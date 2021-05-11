const env = require('dotenv').config()
require('./db.js');
const Discord = require('discord.js');
const Guild = require('./models/guild');
const gc = require('./controllers/guild')

const client = new Discord.Client({ disableEveryone: false });

client.once('ready', () => {
  console.log('Ready!');
});

client.on('message', (message) => {
  // on ~setrole command
  if (message.content.toLowerCase().substring(0, 9) === '~setrole ') {
    // Set the new @ role
    const alertRole = message.content.substring(9)

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
    const homeChannel = message.channel.id
    gc.createOrUpdateGuildInfo(message, { homechannel: homeChannel })

    message.channel.send('This bein me home now.');
  }
});

function getMembers(channelState) {
  if (channelState.channel === undefined || channelState.channel === null) {
    console.log('Could not get members from empty channel (channelState.channel is null)')
    return 0;
  }

  const channelUserCount = channelState.channel.members.size

  return channelUserCount
}

client.on('voiceStateUpdate', (oldState, newState) => {
  console.log('Voice state changed');
  const oldStateMembers = getMembers(oldState);
  const newStateMembers = getMembers(newState);

  if (oldStateMembers === 0 && newStateMembers === 1) {
    let name;
    if (newState.member.nickname !== undefined && newState.member.nickname !== null) {
      name = newState.member.nickname
    } else {
      name = newState.member.user.username
    }

    Guild.findOne({ guildID: newState.guild.id })
      .then((guild) => {
        const alertrole = guild.alertrole ? `<@&${guild.alertrole}>` : '@here'
        client.channels.fetch(guild.homechannel)
          .then((homechannel) => {
            const messageValue = `${alertrole} ... ${name} is all alone in: ${newState.channel.name}. Join and say hello.`

            if (homechannel !== undefined) {
              try {
                homechannel.send(messageValue)
              } catch (err) {
                console.log(err)
              }
            } else {
              console.log(messageValue)
              console.log('Message sent to default channel because home channel is not defined')
            }
          })
          .catch((err) => {
            console.log(err)
          })
      })
  }
});

client.login(process.env.BOT_TOKEN);
