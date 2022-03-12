const gc = require('../controllers/guild')

function setRole(message) {
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

module.exports = setRole