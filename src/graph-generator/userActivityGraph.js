const D3Node = require('d3-node')

async function userActivityGraph(data, tartDateString, endDateString) {
  const d3n = new D3Node()
  const d3 = d3n.d3

  const circleData = parseUserActivity(data)

  console.log(circleData)

  const margin = { top: 60, right: 50, bottom: 50, left: 50 };
  let height = 600
  let width = 600

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
      text: user.key,
      value: user.count
    }
  })

  circles.sort((a, b) => b.r - a.r);

  d3.packSiblings(circles);

  const users = graphArea.append('g')
    .attr('transform', `translate(${width / 2},${height / 2.5})`)

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
    .text(d => d.value)
    .attr('text-anchor', 'middle')
    .attr('x', d => d.x)
    .attr('y', d => (d.y + d.r / 4) + d.r / 4)

  // create the graph title
  graphArea.append("text")
    .attr("x", (width / 2))
    .attr("y", 45)
    .attr("text-anchor", "middle")
    .style("font-size", "20px")
    .style('font-family', "'Roboto', sans-serif")
    .text("Ranked User activity for ")

  return d3n.svgString()
}

function parseUserActivity(data) {
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
        userObj[userID] = { count: 0, key: userID }
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