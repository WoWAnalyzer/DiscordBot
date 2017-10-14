const extractUrls = require('./extractUrls');
const { URL } = require('url');

function onMessage(client, msg) {
  if (msg.author.bot) {
    return;
  }
  const urls = extractUrls(msg.content);
  if (!urls || urls.length !== 1) {
    // Ignore messages without links (for obvious reasons).
    // Ignore messages with more than 1 link. This might be revised later, but for now it seems likely that messages with multiple links may not be requests for log analysis. Ofc this is a very simplified requirement and I think it can be removed once we ignore repeated report links within a certain period of time, as that should be enough to prevent spammy, annoying responses.
    return;
  }
  urls.forEach(urlString => {
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

    // TODO: create a group for the # part of the WCL URL
    // TODO: filter for fight=XX and source=XX for #444
    // TODO: Ignore URLs with pins/filters

    msg.channel.send(`https://wowanalyzer.com/report/${reportCode}`);
  });
}

module.exports = onMessage;
