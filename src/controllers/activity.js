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

async function getActivitiesInDateRange(guildID, startDate, endDate) {
  // get the activity data in the date range from the guild
  // get the data sorted by date
  const activityData = await Activity.find({
    guildID: guildID,
    created_at: {
      $gt: startDate,
      $lt: endDate
    }
  }).sort({ "created_at": 1 })

  return activityData
}

module.exports = { addActivity, getActivitiesInDateRange }