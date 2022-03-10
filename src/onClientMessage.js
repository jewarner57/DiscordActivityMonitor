const gc = require('./controllers/guild')

function onClientMessage(message) {
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
}

exports.onClientMessage = onClientMessage