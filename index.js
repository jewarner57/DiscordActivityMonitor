const env = require('dotenv').config()
const Discord = require('discord.js');
const client = new Discord.Client({ disableEveryone: false });

let homeChannel;

client.once('ready', () => {
    console.log('Ready!');
});

client.on('message', message => {

    if (message.content.toLowerCase() === '~sethome') {
        homeChannel = message.channel
        message.channel.send('Confirmed...');
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

        let messageValue = `@here ... ${name} is all alone in: ${newState.channel.name}. Join and say hello.`

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
        //console.log(arr.length)

        return channelUserCount
    }
}

client.login(process.env.BOT_TOKEN);