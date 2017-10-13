const Discord = require('discord.js');

const onReady = require('./onReady');
const onMessage = require('./onMessage');

const client = new Discord.Client();
client.on('ready', () => onReady(client));
client.on('message', msg => onMessage(client, msg));
client.login(process.env.DISCORD_TOKEN);
