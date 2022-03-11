const Guild = require('./models/guild');
const activityController = require('./controllers/activity')

function onVoiceStateUpdate(client, oldState, newState) {
    console.log(`Voice state changed - ${new Date()}`);

    const oldStateMembers = getMembers(oldState);
    const newStateMembers = getMembers(newState);

    // If a user joins an empty channel then send an activity ping
    if (oldStateMembers.length === 0 && newStateMembers.length === 1) {
        sendVoiceStatePing(client, newState)
    }

    // save the current users to a new activity
    trackVoiceActivity(oldState, newState, oldStateMembers, newStateMembers)
}

function trackVoiceActivity(oldState, newState, oldStateMembers, newStateMembers) {
    // set IDs based on new state
    let channelID = newState?.channel?.id
    let guildID = newState?.channel?.guild?.id
    let userIDs = newStateMembers

    // set IDs based on old state
    if (!channelID || !guildID) {
        channelID = oldState.channel.id
        guildID = oldState.channel.guild.id
        userIDs = oldStateMembers
    }

    activityController.addActivity(guildID, { channelID, userIDs })
}

function getMembers(channelState) {
    if (!channelState.channel) {
        return [];
    }

    const channelUsers = Array.from(channelState.channel.members.values()).map((member) => {
        return member.user.id
    })

    return channelUsers
}

function sendVoiceStatePing(client, newState) {
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

exports.onVoiceStateUpdate = onVoiceStateUpdate