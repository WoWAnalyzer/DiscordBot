import {
  Client,
  SlashCommandBuilder,
  SlashCommandStringOption,
} from "discord.js";
import * as metrics from "./metrics";

export default function onReady(client: Client) {
  console.log(`Logged in as ${client.user?.tag}!`);
  client.user?.setActivity("WoWAnalyzer.com");

  const numGuilds = client.guilds.cache.size;
  console.log("Currently in", numGuilds, "servers");
  metrics.guildGauge.set(numGuilds);

  // TODO: Determine if we still need this after the initial setup. I think Prometheus - if they ever saw a server - will then continue to count it properly.
  client.guilds.cache.forEach((guild) => {
    // Set up the counter so that the first response for is counted
    // see https://github.com/prometheus/prometheus/issues/3886 or https://github.com/prometheus/prometheus/issues/1673
    metrics.messagesSentCounter.labels(guild.name).inc(0);
  });

  // FIXME metrics.createServer();
}
