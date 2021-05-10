const env = require('dotenv').config()
require('./db.js');
const Guild = require("./models/guild");
const gc = require('./controllers/guild')

let mongoose = require("mongoose")

const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: false });

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', message => {

  // on ~setrole command
  if (message.content.toLowerCase().substring(0, 9) === '~setrole ') {
    // Set the new @ role
    let alertRole = message.content.substring(9)

    message.guild.roles.create({
      data: {
        name: alertRole,
        color: 'BLUE',
      },
      reason: 'This role recieves voice activity pings.',
    })
      .then((role) => {
        gc.createOrUpdateGuildInfo(message, { alertrole: role.id })
      })
      .catch((err) => {
        console.log(err)
      })


    message.channel.send(`Created the role ${alertRole}. Users with this role will recieve voice activity pings.`);
  }

  // on ~sethome command
  if (message.content.toLowerCase() === '~sethome') {
    // Set the new home channel
    let homeChannel = message.channel.id
    gc.createOrUpdateGuildInfo(message, { homechannel: homeChannel })

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

    Guild.findOne({ guildID: newState.guild.id })
      .then((guild) => {
        let alertrole = guild.alertrole ? `<@&${guild.alertrole}>` : '@here'
        client.channels.fetch(guild.homechannel)
          .then((homechannel) => {



            let messageValue = `${alertrole} ... ${name} is all alone in: ${newState.channel.name}. Join and say hello.`

            if (homechannel !== undefined) {
              try {
                homechannel.send(messageValue)
              }
              catch (err) {
                console.log(err)
              }
            }
            else {
              console.log(messageValue)
              console.log("Message sent to default channel because home channel is not defined")
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
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