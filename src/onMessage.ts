import * as Sentry from "@sentry/node";
import { URL } from "url";

import parseHash from "./common/parseHash";
import extractUrls from "./extractUrls";
import getFights from "./getFights";
import makeAnalyzerUrl from "./makeAnalyzerUrl";
import {
  isOnCooldown,
  putOnCooldown,
  checkHistoryPurge,
} from "./memoryHistory";
import {
  ChatInputCommandInteraction,
  Client,
  Message,
  PermissionsBitField,
} from "discord.js";

const debug = true || process.env.NODE_ENV === "development"; // log by default for now so we can analyze where it needs improving

const URL_LIMIT = 1;

function getUrlsFromMessage(msg: Message): string[] {
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

function getReportCode(wowaUrl: string): string {
  // url is in format https://wowanalyzer.com/report/<reportcode>
  const split = wowaUrl.split("/");
  return split[split.length - 1];
}

function filterUndefined<T>(arr: (T | undefined)[]): T[] {
  return arr.filter((ele): ele is T => {
    return ele !== undefined;
  });
}

// const DEPRECATION_MESSAGE =
//   "\n\nDue to changes by Discord, this bot will no longer auto respond to messages after <t:1661878799:f>. To get WoWAnalyzer links after that, use the `/analyze` command.";
const DEPRECATION_MESSAGE = "";

function createMessage(
  analysisUrls: Array<string | undefined>,
  fromInteraction?: boolean
): string {
  let s = ``;
  let numAdded = 1;
  let filteredUrls = filterUndefined(analysisUrls);

  if (filteredUrls.length === 1) {
    return filteredUrls[0] + (!fromInteraction ? DEPRECATION_MESSAGE : "");
  }

  for (const url of filteredUrls) {
    if (numAdded > 0) {
      s += `\n`;
    }
    s += `${numAdded}: ${url}`;
    numAdded += 1;
  }
  return s + (!fromInteraction ? DEPRECATION_MESSAGE : "");
}

function handleReject(error: Error & { statusCode: number }): void {
  if ([400].includes(error.statusCode)) {
    // Known status codes, so no need to log.
    // 400 = report does not exist or is private.
    debug && console.log("400 response: report does not exist or is private.");
    return;
  }
  Sentry.captureException(error);
  console.error(error);
}

type ReportUrlData = {
  url: URL;
  reportCode: string;
  hash: ReturnType<typeof parseHash>;
};

function parseReportUrl(urlString: string): ReportUrlData | undefined {
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

  return {
    url,
    reportCode,
    hash: parseHash(url.hash),
  };
}

async function convertUrl({
  reportCode,
  hash: { fight: fightId, source: playerId },
}: ReportUrlData): Promise<string | undefined> {
  try {
    const fightsJson = await getFights(reportCode);
    const report = JSON.parse(fightsJson);

    return makeAnalyzerUrl(report, reportCode, fightId, playerId);
  } catch {
    return undefined;
  }
}

export default function onMessage(client: Client, msg: Message) {
  if (msg.author.id === client.user?.id) {
    // don't care about messages from the WowA bot
    return;
  }
  const start = process.hrtime();
  const isServer = msg.guild !== null;
  const isPrivateMessage = msg.channel === null;
  const serverName = isServer ? msg.guild.name : "PM";
  const rawChannelName = msg.channel.isDMBased() ? "PM" : msg.channel.name;
  const channelName = msg.channel.isDMBased()
    ? "PM"
    : `${serverName} (#${msg.channel.name})`;

  const urls = getUrlsFromMessage(msg);
  if (!urls || urls.length > URL_LIMIT) {
    // Ignore messages without links (for obvious reasons).
    return Promise.resolve();
  }

  return Promise.all(
    urls.map(async (urlString) => {
      const data = parseReportUrl(urlString);

      if (!data) {
        return;
      }

      const {
        url,
        reportCode,
        hash: { fight: fightId, source: playerId, ...others },
      } = data;
      const serverId = msg.guild?.id ?? msg.author.id;

      if (isServer && !isPrivateMessage) {
        if (isOnCooldown(serverId, reportCode)) {
          // Already responded once in this server, ignore it for now to avoid spamming while analysis is being done. This might false-positive when 2 different players want to analyze the same log.
          debug &&
            console.log(
              "Ignoring",
              url.href,
              "in",
              msg.guild.name,
              `(${rawChannelName})`,
              ": already seen reportCode recently."
            );
          return;
        }
        checkHistoryPurge();
      }
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

      return convertUrl(data);
    })
  ).then((values) => {
    try {
      if (
        !isServer ||
        (client.user &&
          !msg.channel.isDMBased() &&
          msg.channel
            .permissionsFor(client.user)
            ?.has(PermissionsBitField.Flags.SendMessages))
      ) {
        const messageToSend = createMessage(values);

        if (messageToSend.length === 0) {
          return;
        }

        msg.channel.send(messageToSend);

        values.map((url) => {
          if (url != undefined) {
            let reportCode = getReportCode(url);
            putOnCooldown(msg.guild?.id ?? msg.author.id, reportCode);
          }
        });

      } else {
        console.warn("No permission to write to this channel.", channelName);
      }
    } catch (error) {
      handleReject(error as Error & { statusCode: number });
    }
  }, handleReject);
}

export async function handleInteraction(
  interaction: ChatInputCommandInteraction
): Promise<void> {
  if (interaction.commandName === "analyze") {
    const data = parseReportUrl(interaction.options.getString("log")!);

    if (!data) {
      await interaction.reply({
        content: "That isn't a valid Warcraft Logs report.",
        ephemeral: true,
      });
      return;
    }

    const result = await convertUrl(data);
    if (!result) {
      await interaction.reply({
        content:
          "Unable to load report. That link may be invalid, or Warcraft Logs may be experiencing issues.",
        ephemeral: true,
      });
      return;
    }

    await interaction.reply(createMessage([result], true));
  }
}
