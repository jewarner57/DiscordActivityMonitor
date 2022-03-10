const client = require("./index.js")
const Guild = require('./models/guild');

function onVoiceStateUpdate(client, oldState, newState) {
    console.log(`Voice state changed - ${new Date()}`);
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
                        const messageValue = `${alertrole} ... ${name} is all alone in **${newState.channel.name}**. Join and say hello.`

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
}

function getMembers(channelState) {
    if (channelState.channel === undefined || channelState.channel === null) {
        return 0;
    }

    const channelUserCount = channelState.channel.members.size

    return channelUserCount
}

exports.onVoiceStateUpdate = onVoiceStateUpdate