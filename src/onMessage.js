import { URL } from "url";
import Raven from "raven";

import parseHash from "./common/parseHash";
import extractUrls from "./extractUrls";
import getFights from "./getFights";
import makeAnalyzerUrl from "./makeAnalyzerUrl";
import {
  isOnCooldown,
  putOnCooldown,
  checkHistoryPurge,
} from "./memoryHistory";
import * as metrics from "./metrics";

const debug = true || process.env.NODE_ENV === "development"; // log by default for now so we can analyze where it needs improving

function getUrlsFromMessage(msg) {
  let urls = extractUrls(msg.content);
  // WebHooks may send embeds that we also want to respond to
  msg.embeds.forEach((embed) => {
    if (embed.url) {
      // Sanity check that the URL is actually an URL
      urls = [...urls, ...extractUrls(embed.url)];
    }
  });
  return urls;
}

function getReportCode(wowaUrl) {
  // url is in format https://wowanalyzer.com/report/<reportcode>
  const split = wowaUrl.split("/");
  return split[split.length - 1];
}

function filterUndefined(arr) {
  return arr.filter((ele) => {
    return ele !== undefined;
  });
}

function createMessage(analysisUrls) {
  let s = ``;
  let numAdded = 1;
  let filteredUrls = filterUndefined(analysisUrls);

  if (filteredUrls.length === 1) {
    return filteredUrls[0];
  }

  for (const url of filteredUrls) {
    if (numAdded > 0) {
      s += `\n`;
    }
    s += `${numAdded}: ${url}`;
    numAdded += 1;
  }
  return s;
}

function handleReject(error) {
  if ([400].includes(error.statusCode)) {
    // Known status codes, so no need to log.
    // 400 = report does not exist or is private.
    debug && console.log("400 response: report does not exist or is private.");
    return;
  }
  Raven.captureException(error);
  console.error(error);
}

export default function onMessage(client, msg) {
  if (msg.author.id === client.user.id) {
    // don't care about messages from the WowA bot
    return;
  }
  const start = process.hrtime();
  const isServer = msg.guild !== null;
  const isPrivateMessage = msg.channel === null;
  const serverName = isServer ? msg.guild.name : "PM";
  const channelName = isServer ? `${serverName} (#${msg.channel.name})` : "PM";

  const urls = getUrlsFromMessage(msg);
  if (!urls || urls.length > process.env.URL_LIMIT) {
    // Ignore messages without links (for obvious reasons).
    return Promise.resolve();
  }

  return Promise.all(
    urls.map(async (urlString) => {
      let url;
      try {
        url = new URL(urlString);
      } catch (error) {
        return;
      }
      if (!url.host.match(/warcraftlogs\.com$/)) {
        // The URL must be from the WCL domain.
        return;
      }
      const path = url.pathname.match(/^\/reports\/([a-zA-Z0-9]{16})\/?$/);
      if (!path) {
        // The URL must be to a single report.
        return;
      }

      const reportCode = path[1];
      const serverId = msg.guild.id;

      if (isServer && !isPrivateMessage) {
        if (isOnCooldown(serverId, reportCode)) {
          // Already responded once in this server, ignore it for now to avoid spamming while analysis is being done. This might false-positive when 2 different players want to analyze the same log.
          debug &&
            console.log(
              "Ignoring",
              url.href,
              "in",
              msg.guild.name,
              `(#${msg.channel.name})`,
              ": already seen reportCode recently."
            );
          return;
        }
        checkHistoryPurge();
      }
      const { fight: fightId, source: playerId, ...others } = parseHash(
        url.hash
      );

      if (
        isServer &&
        (others.start ||
          others.end ||
          others.pins ||
          others.phase ||
          others.ability ||
          others.view)
      ) {
        // When the report link has more advanced filters it's probably being used for manual analysis and an auto response may not be desired.
        debug &&
          console.log(
            "Ignoring",
            url.href,
            "in",
            channelName,
            ": it has advanced filters."
          );
        return;
      }

      const fightsJson = await getFights(reportCode);
      const report = JSON.parse(fightsJson);

      return makeAnalyzerUrl(report, reportCode, fightId, playerId);
    })
  ).then((values) => {
    try {
      if (
        !isServer ||
        msg.channel.permissionsFor(client.user).has("SEND_MESSAGES")
      ) {
        const messageToSend = createMessage(values);

        if (messageToSend.length === 0) {
          return;
        }

        msg.channel.send(messageToSend);

        values.map((url) => {
          if (url != undefined) {
            let reportCode = getReportCode(url);
            putOnCooldown(msg.guild.id, reportCode);
          }
        });

        // Metrics
        metrics.messagesSentCounter.labels(serverName).inc();
        const elapsedMs = process.hrtime(start)[1] / 1000000;
        metrics.reportResponseLatencyHistogram.observe(elapsedMs);
      } else {
        console.warn("No permission to write to this channel.", channelName);
      }
    } catch (error) {
      handleReject(error);
    }
  }, handleReject);
}
