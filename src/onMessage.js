function onMessage(client, msg) {
  if (msg.author.bot) {
    return;
  }
  const content = msg.content;
  // TODO: create a group for the # part of the WCL URL
  // TODO: Ignore URLs with pins/filters
  const match = content.trim().match(/^(.*reports\/)?([a-zA-Z0-9]{16})\/?(#.*)?(.*)?$/);
  if (match && match[2]) {
    // TODO: filter for fight=XX and source=XX for #444
    msg.channel.send(`https://wowanalyzer.com/report/${match[2]}`);
  }
}

module.exports = onMessage;
