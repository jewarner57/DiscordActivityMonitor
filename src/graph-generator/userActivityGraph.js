const D3Node = require('d3-node')
const ED = require('@jewarner57/easydate')

async function userActivityGraph(data, startDate, endDate, message) {
  const d3n = new D3Node()
  const d3 = d3n.d3

  const circleData = await parseUserActivity(data, message)

  const margin = { top: 60, right: 30, bottom: 20, left: 30 };
  let height = 800
  let width = 800

  const svg = d3n.createSVG(width, height)

  svg.append("rect")
    .attr("width", "100%")
    .attr("height", "100%")
    .attr("fill", "#fff");

  const graphArea = svg.append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  width = width - margin.left - margin.right;
  height = height - margin.top - margin.bottom;

  const sizeExtent = d3.extent(circleData, d => parseFloat(d.count))
  const sizeScale = d3.scaleLinear()
    .domain(sizeExtent)
    .range([30, 150])

  const colorExtent = d3.extent(circleData, d => parseFloat(d.count))
  const colorScale = d3.scaleLinear()
    .domain(colorExtent)
    .range([0, 100])

  let circles = circleData.map((user) => {
    return {
      r: sizeScale(user.count),
      color: `hsl(208, ${colorScale(user.count)}%, 60%)`,
      text: user.username,
      value: user.count / 1000 / 60 / 60 // <- conversion to get hours from ms
    }
  })

  circles.sort((a, b) => b.r - a.r);

  d3.packSiblings(circles);

  const users = graphArea.append('g')
    .attr('transform', `translate(${width / 2},${height / 2})`)

  // user circles
  users
    .append('g')
    .selectAll('circle.node')
    .data(circles)
    .enter()
    .append('circle')
    .classed('node', true)
    .attr('cx', d => d.x)
    .attr('cy', d => d.y)
    .attr('r', d => d.r)
    .attr('fill', d => d.color)

  // user labels
  users
    .append('g')
    .selectAll('text.node')
    .data(circles)
    .enter()
    .append('text')
    .style('font-family', "'Roboto', sans-serif")
    .style('font-size', d => d.r / 3.2)
    .text(d => `${d.text.substring(0, 12)}`)
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => d.y)

  // user time count labels
  users
    .append('g')
    .selectAll('text.node')
    .data(circles)
    .enter()
    .append('text')
    .style('font-family', "'Roboto', sans-serif")
    .style('font-size', d => d.r / 3)
    .text(d => `${Math.floor(d.value * 10) / 10} hrs`)
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => (d.y + d.r / 4) + d.r / 4)

  // format dates 
  const startDateFormatString = new ED(startDate).format('(%W, %B %d, %h:%I)')
  const endDateFormatString = new ED(endDate).format('(%W, %B %d, %h:%I)')

  // create the graph title
  svg.append("text")
    .attr("x", ((width + margin.right + margin.left) / 2))
    .attr("y", 45)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style('font-family', "'Roboto', sans-serif")
    .text(`Server User Activity for: ${startDateFormatString} to ${endDateFormatString}`)

  return d3n.svgString()
}

async function parseUserActivity(data, message) {
  // Keep track of how many people are active in VC across multiple channels 
  const userObj = {}
  let prevActivity = data[0]

  for(const activity of data) {
    // set all users to inactive, increment count time of active users
    for(const key of Object.keys(userObj)) {
      if(userObj[key].active) {
        const currentTime = new Date(activity.created_at)
        const prevTime = new Date(prevActivity.created_at)
        const duration = currentTime.getTime() - prevTime.getTime()
        // increment time count by difference
        userObj[key].count += duration
      }
      userObj[key].active = false
    }

    // get the currently active users
    for (const userID of activity.userIDs) {
      // mark users as active
      if (!userObj[userID]) {
        // Get the username from an ID
        // members.fetch(id) checks for cached users first before
        // making an api request
        const { user: { username } } = await message.guild.members.fetch(userID)
        userObj[userID] = { count: 0, key: userID, username }
      }
      userObj[userID].active = true 
    }

    prevActivity = activity
  }

  // return a list of users
  result_data = []
  for(const value of Object.values(userObj)) {
    result_data.push(value)
  }

  return result_data
}

module.exports = userActivityGraph