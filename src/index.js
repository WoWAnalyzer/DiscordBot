import Discord from 'discord.js';

import onReady from './onReady';
import onMessage from './onMessage';

const client = new Discord.Client();
client.on('ready', () => onReady(client));
client.on('message', msg => onMessage(client, msg));
client.login(process.env.DISCORD_TOKEN);
