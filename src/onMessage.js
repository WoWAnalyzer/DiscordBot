const extractUrls = require('./extractUrls');

function onMessage(client, msg) {
  if (msg.author.bot) {
    return;
  }
  const content = msg.content;
  const urls = extractUrls(content);
  if (!urls || urls.length !== 1) {
    // Ignore messages without links (for obvious reasons).
    // Ignore messages with more than 1 link. This might be revised later, but for now it seems likely that messages with multiple links may not be requests for log analysis. Ofc this is a very simplified requirement and I think it can be removed once we ignore repeated report links within a certain period of time, as that should be enough to prevent spammy, annoying responses.
    return;
  }
  urls.forEach(url => {
    // TODO: create a group for the # part of the WCL URL
    // TODO: Ignore URLs with pins/filters
    const match = url.match(/warcraftlogs\.com\/reports\/([a-zA-Z0-9]{16})\/?(#.*)?(.*)?$/);
    if (match && match[1]) {
      // TODO: filter for fight=XX and source=XX for #444
      msg.channel.send(`https://wowanalyzer.com/report/${match[1]}`);
    }
  });
}

module.exports = onMessage;
