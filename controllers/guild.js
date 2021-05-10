const Guild = require("../models/guild");

function createOrUpdateGuildInfo(message, data) {
  // Find the guild
  let guild = Guild.findOne({ guildID: message.guild.id })
    .then((guild) => {
      // If the guild doesnt exists yet
      if (guild === null) {
        // Create the guild
        addGuild(message.guild.id, data)
      }
      else {
        // create new guild object
        let updatedGuild = guild
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

function addGuild(id, data) {

  let guild = new Guild({
    guildID: id,
    homechannel: data.homechannel,
    alertrole: data.alertrole
  });

  guild.save()
    .then(guild => {
      Guild.findById(guild._id)
        .then((newGuild) => {
          return newGuild
        })
    })
    .catch(err => {
      console.log(err.message);
    });
}

function updateGuild(guildID, updatedGuild) {
  Guild.findOne({ guildID: guildID })
    .then(doc => Guild.updateOne({ _id: doc._id }, updatedGuild))
}

module.exports.createOrUpdateGuildInfo = createOrUpdateGuildInfo