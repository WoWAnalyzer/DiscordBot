import Discord, { GatewayIntentBits } from "discord.js";

import onReady from "./onReady";
import onMessage, { handleInteraction } from "./onMessage";
import * as metrics from "./metrics";

import "./init";

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error(
    "No API token provided in DISCORD_TOKEN. Get a token for a test bot to test this here: https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token"
  );
  process.exit(1);
}

if (process.env.NODE_ENV === "development") {
  console.log("Token:", token);
}

async function buildClient(
  intents: GatewayIntentBits[]
): Promise<Discord.Client> {
  const client = new Discord.Client({
    intents,
  });
  client.on("ready", () => onReady(client));
  client.on("messageCreate", (msg) => onMessage(client, msg));
  // Not sure if I can pass console.error directly, better safe than sorry.
  client.on("error", (e) => console.error(e));
  client.on("uncaughtException", (e) => console.error(e));
  client.on("rejectionHandled", (e) => console.error(e));
  client.on("warn", (e) => console.warn(e));
  // discord.js sometimes randomly stops responding to messages. It might get stuck in a loop. Log *everything* until we can get this fixed.
  // client.on('debug', e => console.info(e));
  client.on("disconnect", (e) => console.warn("disconnect", e));
  client.on("reconnecting", (e) => console.warn("reconnecting", e));
  client.on("commandError", (e) => console.error("commandError", e));
  client.on("guildCreate", async (guild) => {
    console.log("Joined server", guild.name, client.guilds.cache.size);
    metrics.guildGauge.set(client.guilds.cache.size);

    // Set up the counter so that the first response for new servers is counted
    // see https://github.com/prometheus/prometheus/issues/3886 or https://github.com/prometheus/prometheus/issues/1673
    metrics.messagesSentCounter.labels(guild.name).inc(0);
  });
  client.on("guildDelete", async (guild) => {
    console.log("Left server", guild.name, client.guilds.cache.size);
    metrics.guildGauge.set(client.guilds.cache.size);
  });
  client.on("interactionCreate", (interaction) => {
    interaction.isChatInputCommand() && handleInteraction(interaction);
  });
  await client.login(token);
  return client;
}

// this tries to register the full message content mode, and if that fails it registers for interactions only
buildClient([
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
]).catch(() => {
  return buildClient([GatewayIntentBits.Guilds]);
});
