import {
  Client,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";

export default function onReady(client: Client) {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.user?.setActivity("WoWAnalyzer.com");

  const numGuilds = client.guilds.cache.size;
  console.log("Currently in", numGuilds, "servers");
}
