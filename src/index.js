require('dotenv').config()
require('./db.js');
const Discord = require('discord.js');
const { onVoiceStateUpdate } = require('./onVoiceStateUpdate.js');
const { onClientMessage } = require('./onClientMessage');

const client = new Discord.Client({ disableEveryone: false });

client.once('ready', () => {
  console.log('-- Discord connection ready! --');
});

client.on('voiceStateUpdate', (oldState, newState) => {
  onVoiceStateUpdate(client, oldState, newState)
});

client.on('message', (message) => {
  onClientMessage(message)
});

client.login(process.env.BOT_TOKEN);

exports.client = client