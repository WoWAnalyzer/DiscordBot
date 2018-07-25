function extractUrls(message) {
  // Source: https://stackoverflow.com/a/11209098/684353
  const uri_pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;

  return message.match(uri_pattern) || [];
}

module.exports = extractUrls;
