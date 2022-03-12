const Activity = require('../models/activity');
const drawGraph = require('../graph-generator/make-graph.js')
const svgToPng = require('../graph-generator/svg-to-png.js')
const { MessageAttachment } = require('discord.js')

async function graphActivity(message) {
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

    if (activityData.length < 1) {
        message.channel.send("No voice activity data was found for that date range.")
        return
    }

    // send loading status message that gets updated through each step
    message.channel.send(`Found ${activityData.length} data points.`)

    // pass the data to D3 to be processed into an SVG
    message.channel.send(`Drawing graph...`)
    const imageBuffer = drawGraph(activityData)

    // Put the D3 svg into a JS Canvas
    // Convert the JS Canvas object to a PNG
    // const pngBuffer = svgToPng(svg, 100, 200)

    // Send the PNG as an attachment to a success message
    const file = new MessageAttachment(imageBuffer);

    message.channel.send('Graph Complete:')
    message.channel.send(file)
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