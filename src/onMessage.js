import { URL } from 'url';

import getFightName from './common/getFightName';
import extractUrls from './extractUrls';
import getFights from './getFights';

function parseHash(hash) {
  let fightId = null;
  let playerId = null;
  if (hash) {
    const trimmedHash = hash.substr(1);
    const hashParts = trimmedHash.split('&');
    hashParts.forEach(hashPart => {
      const [ key, value ] = hashPart.split('=');
      if (key === 'fight') {
        fightId = Number(value);
      } else if (key === 'source') {
        playerId = Number(value);
      }
    });
  }
  return { fightId, playerId };
}

export default function onMessage(client, msg) {
  if (msg.author.bot) {
    return;
  }
  const urls = extractUrls(msg.content);
  if (!urls || urls.length !== 1) {
    // Ignore messages without links (for obvious reasons).
    // Ignore messages with more than 1 link. This might be revised later, but for now it seems likely that messages with multiple links may not be requests for log analysis. Ofc this is a very simplified requirement and I think it can be removed once we ignore repeated report links within a certain period of time, as that should be enough to prevent spammy, annoying responses.
    return;
  }

  return Promise.all(
    urls.map(async urlString => {
      const url = new URL(urlString);
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
      const { fightId, playerId } = parseHash(url.hash);

      try {
        const fightsJson = await getFights(reportCode);
        const report = JSON.parse(fightsJson);

        const url = [
          `https://wowanalyzer.com/report/${reportCode}`,
        ];

        if (fightId) {
          const fight = report.fights.find(fight => fight.id === fightId);
          const fightName = getFightName(report, fight);
          url.push(`${fight.id}-${encodeURI(fightName).replace(/%20/g, '+')}`);
          if (playerId) {
            const player = report.friendlies.find(player => player.id === playerId);
            url.push(player.name);
          }
        }

        // TODO: Ignore URLs with pins/filters

        msg.channel.send(url.join('/'));
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
