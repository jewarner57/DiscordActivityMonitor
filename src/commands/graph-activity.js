const Activity = require('../models/activity');
const serverActivityGraph = require('../graph-generator/serverActivityGraph.js')
const userActivityGraph = require('../graph-generator/userActivityGraph.js')
const { MessageAttachment } = require('discord.js')
const ED = require('@jewarner57/easydate')
var svg2img = require('svg2img');

async function graphActivity(message, graphType) {
    const dateRange = message.content.substring(15).split(" to ")
    const startDate = new Date(dateRange[0])
    const endDate = new Date(dateRange[1])

    if (foundErrorsInDates(message, startDate, endDate)) { return }

    // get the activity data in the valid date range from the valid guild
    // get the data sorted by date
    message.channel.send("Loading Activity Logs...")
    const activityData = await Activity.find({
        guildID: message.channel.guild.id,
        created_at: {
            $gt: startDate,
            $lt: endDate
        }
    }).sort({ "created_at": 1 })


    const startDateFormatString = new ED(startDate).format('%M-%D-%Y')
    const endDateFormatString = new ED(endDate).format('%M-%D-%Y')
    if (activityData.length < 1) {
        message.channel.send(`
        No voice activity data was found in date range: (${startDateFormatString} -> ${endDateFormatString})
        `)
        return
    }

    // send loading status message that gets updated through each step
    message.channel.send(`Found ${activityData.length} data points.`)

    // pass the data to D3 to be processed into an SVG
    message.channel.send(`Drawing graph...`)

    let svgString = ""
    if (graphType === "server-activity") {
      svgString = serverActivityGraph(activityData, startDateFormatString, endDateFormatString)
    }
    else {
      svgString = await userActivityGraph(activityData, startDateFormatString, endDateFormatString, message) 
    }
    
    // Convert the svg string object to a buffer 
    svg2img(svgString, function (error, buffer) {
      // Send the buffer as an attachment to a success message 
      const file = new MessageAttachment(buffer);
      message.channel.send('Graph Complete:')
      message.channel.send(file)
    });
}

function foundErrorsInDates(message, startDate, endDate) {
    if (startDate > endDate) {
        message.channel.send("Start date must be before end date.")
        return true
    }

    if (!startDate.isValid() || !endDate.isValid()) {
        sendDateError(message, startDate, "Start")
        sendDateError(message, endDate, "End")
        return true
    }
    return false
}

function sendDateError(message, date, name) {
    error = date.isValid() ? null : `${name} date is not a valid date.`
    error ? message.channel.send(error) : null
}

// https://stackoverflow.com/a/12372720/4901943
Date.prototype.isValid = function () {
    // An invalid date object returns NaN for getTime() and NaN is the only
    // object not strictly equal to itself.
    return this.getTime() === this.getTime();
};

module.exports = graphActivity
