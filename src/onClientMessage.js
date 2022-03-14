const { setRole, setHome, graphActivity } = require('./commands')

function onClientMessage(message) {
    // if the message isnt meant for this bot then ignore it
    if (message.content.substring(0, 1) !== '~') {
        return
    }

    const commandArguments = message.content.toLowerCase().split(" ")
    if (commandArguments.length < 1) {
        message.channel.send('Command Not Found.')
    }

    switch (commandArguments[0]) {
        case '~setrole':
            setRole(message)
            break;
        case '~sethome':
            setHome(message)
            break;
        case '~graph-server-activity':
            graphActivity(message, 'server-activity')
            break;
        case '~graph-user-activity':
            graphActivity(message, 'user-activity')
            break;
        default:
            message.channel.send('Command Not Found.')
    }
}

exports.onClientMessage = onClientMessage