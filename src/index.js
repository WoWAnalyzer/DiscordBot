// noinspection JSFileReferences
import Discord from 'discord.js';
import Raven from 'raven';

import onReady from './onReady';
import onMessage from './onMessage';

if (process.env.NODE_ENV === 'production') {
  Raven.config('https://669adafa75124f91bff5754d9c34b13a:b07f6d83af184b18ac2a554d0509e2f6@sentry.io/253783', {
    captureUnhandledRejections: true,
  }).install();
}

console.log('Token:', process.env.DISCORD_TOKEN);

const client = new Discord.Client();
client.on('ready', () => onReady(client));
client.on('message', msg => onMessage(client, msg));
client.login(process.env.DISCORD_TOKEN);
