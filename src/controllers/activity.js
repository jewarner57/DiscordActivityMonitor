const Activity = require('../models/activity');

function addActivity(id, data) {
    const activity = new Activity({
        guildID: id,
        channelID: data.channelID,
        userIDs: data.userIDs,
    });

    activity.save()
        .then((newActivity) => {
            Activity.findById(newActivity._id)
                .then((createdActivity) => createdActivity)
                .catch((err) => {
                    console.log(err.message)
                })
        })
        .catch((err) => {
            console.log(err.message);
        });
}

module.exports.addActivity = addActivity