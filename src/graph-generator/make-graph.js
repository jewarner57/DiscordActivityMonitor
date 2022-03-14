const D3Node = require('d3-node')

function drawGraph(data, startDateString, endDateString) {
    const d3n = new D3Node()
    const d3 = d3n.d3

    const lineData = parseActivityData(data)
    
    const margin = { top: 60, right: 50, bottom: 50, left: 50 };
    let height = 600
    let width = 600

    const svg = d3n.createSVG(width, height)
    // create background    
    svg.append("rect")
      .attr("width", "100%")
      .attr("height", "100%")
      .attr("fill", "#fff");
      
    const graphArea = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;

    // Create X range
    const x = d3.scaleTime().range([0, width]);
    x.domain(d3.extent(lineData, function (d) { return d.created_at; }));

    // Create Y range
    const y = d3.scaleLinear().range([height, 0]);
    y.domain([
      d3.min(lineData, function (d) { return d.count; }), 
      d3.max(lineData, function (d) { return d.count; })
    ]);

    // Calculate line
    const valueline = d3.line()
      .x(function (d) { return x(d.created_at); })
      .y(function (d) { return y(d.count); })
      .curve(d3.curveLinear);

    // Draw graph line
    graphArea.append("path")
      .data([lineData])
      .attr("class", "line")
      .attr("d", valueline)
      .attr('stroke-width', 5)
      .attr('stroke', '#6495ED')
      .attr('fill', 'none');

    // Draw X axis
    const xAxis_woy = d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M:%S'));

    graphArea.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_woy);

    graphArea.append("g").call(d3.axisLeft(y));

    // Draw data points on line
    graphArea.selectAll(".dot")
      .data(lineData)
      .enter()
      .append("circle")
      .attr("cx", function (d) { return x(d.created_at) })
      .attr("cy", function (d) { return y(d.count) })
      .attr("r", 3);  

    // Draw values on each point
    // graphArea.selectAll(".text")
    //   .data(lineData)
    //   .enter()
    //   .append("text")
    //   .attr("x", function (d, i) { return x(d.created_at) })
    //   .attr("y", function (d) { return y(d.count) })
    //   .attr("dy", "-7")
    //   .text(function (d) { return d.count; });

    // Draw title
    svg.append('text')
      .attr('x', 30)
      .attr('y', 30) 
      .attr('font-size', '18px')
      .text(`Server activity from: ${startDateString} to ${endDateString}`); 

    return d3n.svgString()

} 

function parseActivityData(data) {
  // Keep track of how many people are active in VC across multiple channels 
  const channelObj = {}
  const resultData = []

  for(let activity of data) {
    // Get the channel state from the activity
    channelObj[activity.channelID] = {
      userIDs: activity.userIDs,
      count: activity.userIDs.length
    }

    // Get active users across all channels
    let activeUsers = new Set()
    for (const channelData of Object.values(channelObj)) {
      for(const user of channelData.userIDs) {
        activeUsers.add(user)
      }
    }

    const prevCount = resultData[resultData.length - 1]?.count
    if (prevCount !== activeUsers.size && !isNaN(prevCount)) {
      resultData.push({
        count: prevCount,
        userIDs: [],
        created_at: activity.created_at
      })  
    }

    resultData.push({
      count: activeUsers.size, 
      userIDs: Array.from(activeUsers),
      created_at: activity.created_at  
    })
  }

  return resultData
}

module.exports = drawGraph