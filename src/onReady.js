export default function onReady(client) {
  console.log(`Logged in as ${client.user.tag}!`);
  client.user.setActivity('WoWAnalyzer.com');
}
