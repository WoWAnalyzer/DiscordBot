// noinspection JSFileReferences
import Discord, { Intents } from 'discord.js';

import onReady from './onReady';
import onMessage from './onMessage';
import * as metrics from './metrics';

import './init'

const token = process.env.DISCORD_TOKEN
if (!token) {
  console.error('No API token provided in DISCORD_TOKEN. Get a token for a test bot to test this here: https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token');
  process.exit(1)
}

if (process.env.NODE_ENV === 'development') {
  console.log('Token:', token);
}

const client = new Discord.Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]});
client.on('ready', () => onReady(client));
client.on('messageCreate', msg => onMessage(client, msg));
// Not sure if I can pass console.error directly, better safe than sorry.
client.on('error', e => console.error(e));
client.on('uncaughtException', e => console.error(e));
client.on('rejectionHandled', e => console.error(e));
client.on('warn', e => console.warn(e));
// discord.js sometimes randomly stops responding to messages. It might get stuck in a loop. Log *everything* until we can get this fixed.
// client.on('debug', e => console.info(e));
client.on('disconnect', e => console.warn('disconnect', e));
client.on('reconnecting', e => console.warn('reconnecting', e));
client.on('commandError', e => console.error('commandError', e));
client.on('guildCreate', async guild => {
  console.log('Joined server', guild.name, client.guilds.size);
  metrics.guildGauge.set(client.guilds.size);

  // Set up the counter so that the first response for new servers is counted
  // see https://github.com/prometheus/prometheus/issues/3886 or https://github.com/prometheus/prometheus/issues/1673
  metrics.messagesSentCounter.labels(guild.name).inc(0);
});
client.on('guildDelete', async guild => {
  console.log('Left server', guild.name, client.guilds.size);
  metrics.guildGauge.set(client.guilds.size);
});
client.login(token);
