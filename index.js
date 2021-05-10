const env = require('dotenv').config()

let mongoose = require("mongoose")

const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: false });


let homeChannel;
let alertRole = '@here';

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {

  // on ~setrole command
  if (message.content.toLowerCase().substring(0, 9) === '~setrole ') {
    alertRole = message.content.substring(9)
    message.channel.send(`Alert role is now ${alertRole}`);
  }

  // on ~sethome command
  if (message.content.toLowerCase() === '~sethome') {
    homeChannel = message.channel
    message.channel.send('This bein me home now.');
  }

});

client.on("voiceStateUpdate", function (oldState, newState) {
  console.log(`a user changes voice state`);
  let oldStateMembers = getMembers(oldState);
  let newStateMembers = getMembers(newState);

  if (oldStateMembers === 0 && newStateMembers === 1) {

    let name;
    if (newState.member.nickname != undefined && newState.member.nickname != null) {
      name = newState.member.nickname
    }
    else {
      name = newState.member.user.username
    }

    let messageValue = `@${alertRole} ... ${name} is all alone in: ${newState.channel.name}. Join and say hello.`

    if (homeChannel !== undefined) {
      try {
        homeChannel.send(messageValue)
      }
      catch (err) {
        console.log(err)
      }
    }
    else {
      console.log(messageValue)
      console.log("Message sent to default channel because home channel is not defined")
    }
  }
});

function getMembers(channelState) {
  if (channelState.channel === undefined || channelState.channel === null) {
    console.log('channelState.channel is not defined or null')
    return 0;
  }
  else {
    let arr = []
    channelState.channel.members.map(() => {
      arr.push(this.user)
    })

    let channelUserCount = arr.length

    return channelUserCount
  }
}

client.login(process.env.BOT_TOKEN);