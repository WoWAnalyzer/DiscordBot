import { URL } from 'url';

import parseHash from './common/parseHash';
import extractUrls from './extractUrls';
import getFights from './getFights';
import makeAnalyzerUrl from './makeAnalyzerUrl';
import { isOnCooldown, putOnCooldown, checkHistoryPurge } from './memoryHistory';

const debug = true || process.env.NODE_ENV === 'development'; // log by default for now so we can analyze where it needs improving

export default function onMessage(client, msg) {
  if (msg.author.bot) {
    return Promise.resolve();
  }
  const urls = extractUrls(msg.content);
  if (!urls || urls.length !== 1) {
    // Ignore messages without links (for obvious reasons).
    // Ignore messages with more than 1 link. This might be revised later, but for now it seems likely that messages with multiple links may not be requests for log analysis. Ofc this is a very simplified requirement and I think it can be removed once we ignore repeated report links within a certain period of time, as that should be enough to prevent spammy, annoying responses.
    return Promise.resolve();
  }

  return Promise.all(
    urls.map(async urlString => {
      let url;
      try {
        url = new URL(urlString);
      } catch(error) {
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
      if (isOnCooldown(serverId, reportCode)) {
        // Already responded once in this server, ignore it for now to avoid spamming while analysis is being done. This might false-positive when 2 different players want to analyze the same log.
        debug && console.log('Ignoring', url.href, 'in', msg.guild.name, `(#${msg.channel.name})`, ': already seen reportCode recently.');
        return;
      } else {
        putOnCooldown(serverId, reportCode);
      }
      checkHistoryPurge();

      const { fight: fightId, source: playerId, ...others } = parseHash(url.hash);

      if (others.start || others.end || others.pins || others.phase || others.ability || others.view) {
        // When the report link has more advanced filters it's probably being used for manual analysis and an auto response may not be desired.
        debug && console.log('Ignoring', url.href, 'in', msg.guild.name, `(#${msg.channel.name})`, ': it has advanced filters.');
        return;
      }

      try {
        const fightsJson = await getFights(reportCode);
        const report = JSON.parse(fightsJson);

        const responseUrl = makeAnalyzerUrl(report, reportCode, fightId, playerId);

        debug && console.log('Responding to', url.href, 'in', msg.guild.name, `(#${msg.channel.name})`);
        msg.channel.send(responseUrl);
      }
      catch (err) {
        if ([400].includes(err.statusCode)) {
          // Known status codes, so no need to log.
          // 400 = report does not exist or is private.
          return;
        }
        console.error(err);
      }
    })
  );
}
