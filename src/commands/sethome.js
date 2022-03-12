const gc = require('../controllers/guild')

function setHome(message) {
    // Set the new home channel
    const homeChannel = message.channel.id
    gc.createOrUpdateGuildInfo(message, { homechannel: homeChannel })

    message.channel.send('This bein me home now.');
}

module.exports = setHome