export default function extractUrls(message: string): string[] {
  // Source: https://stackoverflow.com/a/11209098/684353
  const uri_pattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

  return message.match(uri_pattern) || [];
}
