const Activity = require('../models/activity');
const { getActivitiesInDateRange } = require('../controllers/activity')
const { MessageAttachment } = require('discord.js')
const ED = require('@jewarner57/easydate')
var svg2img = require('svg2img');

async function graphActivity(message, paramString, graphGenerator) {
  
    const { startDate, endDate, error } = parseDateRangeFromParam(paramString)

    if (error) { return message.channel.send(error) }
    if (foundErrorsInDates(message, startDate, endDate)) { return }

    message.channel.send("Loading Activity Logs...")
    const guildID = message.channel.guild.id
    activityData = await getActivitiesInDateRange(guildID, startDate, endDate)

    const startDateFormatString = new ED(startDate).format('%W, %B %d, %h:%I')
    const endDateFormatString = new ED(endDate).format('%W, %B %d, %h:%I')
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

    svgString = await graphGenerator(activityData, startDate, endDate, message)
    
    // Convert the svg string object to a buffer 
    svg2img(svgString, function (error, buffer) {
      // Send the buffer as an attachment to a success message 
      const file = new MessageAttachment(buffer);
      message.channel.send('Graph Complete:')
      message.channel.send(file)
    });
}

function parseDateRangeFromParam(paramString) {
  let startDate = NaN
  let endDate = NaN
  let rangeOffset = getDateOffsetFromParam(paramString) 

  if(rangeOffset > 0) {
    startDate = new Date(Date.now() - rangeOffset)
    endDate = new Date()
    return {startDate, endDate, error: null}
  }

  const dateRange = paramString.split(" to ")
  if (dateRange.length >= 2) {
    startDate = new Date(dateRange[0])
    endDate = new Date(dateRange[1])
    return { startDate, endDate, error: null }
  } 
 
  if (rangeOffset === -1) {
    return { startDate, endDate, error: `Invalid Date Range \"${paramString}\"` }
  } 
}

function getDateOffsetFromParam(paramString) {
  let rangeOffset = 0
  const ONE_MINUTE = 60000
  switch (paramString) {
    case "past-minute":
      rangeOffset = ONE_MINUTE
      break;
    case "past-hour":
      rangeOffset = ONE_MINUTE * 60
      break;
    case "past-day":
      rangeOffset = ONE_MINUTE * 60 * 24
      break;
    case "past-week":
      rangeOffset = ONE_MINUTE * 60 * 168
      break;
    case "past-month":
      rangeOffset = ONE_MINUTE * 60 * 730
      break;
    case "past-year":
      rangeOffset = ONE_MINUTE * 60 * 8760
      break;
    case "all-time":
      rangeOffset = Date.now() 
      break;
    default:
      rangeOffset = -1
  }

  return rangeOffset
}

function foundErrorsInDates(message, startDate, endDate) {
    const startDateObj = new Date(startDate)
    const endDateObj = new Date(endDate)

    if (startDateObj > endDateObj) {
        message.channel.send("Start date must be before end date.")
        return true
    }

    if (!startDateObj.isValid() || !endDateObj.isValid()) {
      sendDateError(message, startDateObj, "Start")
      sendDateError(message, endDateObj, "End")
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
