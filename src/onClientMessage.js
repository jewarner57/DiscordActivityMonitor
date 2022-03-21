const { setRole, setHome, graphActivity } = require('./commands')
const serverActivityGraph = require('./graph-generator/serverActivityGraph.js')
const userActivityGraph = require('./graph-generator/userActivityGraph.js')

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
        case '~help':
            message.channel.send('Command help can be found here: github.com/jewarner57/DiscordActivityMonitor')
            break;
        case '~setrole':
            setRole(message)
            break;
        case '~sethome':
            setHome(message)
            break;
        case '~graph-activity':
            parseGraphCommand(message, commandArguments)
            break;
        default:
            message.channel.send('Command Not Found.')
            break;
    }
}

function parseGraphCommand(message, commandArguments) {
  const paramString = commandArguments.slice(2).join(' ')
  if (commandArguments.length < 2) {
    return message.channel.send(
      'Invalid Command Format: ~graph-activity takes one or more arguments. Use ~help for examples.'
    )
  }

  switch (commandArguments[1]) {
    case 'users':
      graphActivity(message, paramString, userActivityGraph)
      break;
    case 'server':
      graphActivity(message, paramString, serverActivityGraph)
      break;
    default:
      message.channel.send(`Invalid argument name: ${commandArguments[1]} is not a valid graph name.`)
      break;
  }
}

exports.onClientMessage = onClientMessage