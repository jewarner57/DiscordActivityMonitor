const Guild = require('../models/guild');

function addGuild(id, data) {
  const guild = new Guild({
    guildID: id,
    homechannel: data.homechannel,
    alertrole: data.alertrole,
  });

  guild.save()
    .then((newGuild) => {
      Guild.findById(newGuild._id)
        .then((createdGuild) => createdGuild)
        .catch((err) => {
          console.log(err.message)
        })
    })
    .catch((err) => {
      console.log(err.message);
    });
}

function updateGuild(guildID, updatedGuild) {
  Guild.findOne({ guildID })
    .then((doc) => Guild.updateOne({ _id: doc._id }, updatedGuild))
}

function createOrUpdateGuildInfo(message, data) {
  // Find the guild
  Guild.findOne({ guildID: message.guild.id })
    .then((guild) => {
      // If the guild doesnt exists yet
      if (guild === null) {
        // Create the guild
        addGuild(message.guild.id, data)
      } else {
        // create new guild object
        const updatedGuild = guild
        if (data.alertrole) { updatedGuild.alertrole = data.alertrole }
        if (data.homechannel) { updatedGuild.homechannel = data.homechannel }

        // Update the guild
        updateGuild(guild.guildID, updatedGuild)
      }
    })
    .catch((err) => {
      console.log(err)
    })
}

module.exports.createOrUpdateGuildInfo = createOrUpdateGuildInfo
