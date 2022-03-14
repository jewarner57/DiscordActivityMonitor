const D3Node = require('d3-node')

function drawGraph(data) {
    const d3n = new D3Node()
    const d3 = d3n.d3

    const lineData = data
    
    const margin = { top: 20, right: 15, bottom: 25, left: 25 };
    let height = 600
    let width = 600

    const svg = d3n.createSVG(width, height)

    width = width - margin.left - margin.right;
    height = height - margin.top - margin.bottom;


    // NEED A WAY TO DEAL WITH PEOPLE BEING IN MULTIPLE CHANNELS AT ONCE

    // set the ranges
    const x = d3.scaleTime().range([0, width]);
    x.domain(d3.extent(lineData, function (d) { return d.created_at; }));

    const y = d3.scaleLinear().range([height, 0]);
    y.domain([
      d3.min(lineData, function (d) { return d.userIDs.length; }), 
      d3.max(lineData, function (d) { return d.userIDs.length; })
    ]);

    const valueline = d3.line()
      .x(function (d) { return x(d.created_at); })
      .y(function (d) { return y(d.userIDs.length); })
      .curve(d3.curveMonotoneX);

    svg.append("path")
      .data([lineData])
      .attr("class", "line")
      .attr("d", valueline)
      .attr('stroke-width', 5)
      .attr('stroke', '#d62124')
      .attr('fill', 'none');

    return d3n.svgString()
} 

module.exports = drawGraph

/*const yearlyDeaths = getYearlyCasualties(deathData)

  const yearExtent = d3.extent(yearlyDeaths, d => d.year)
  const xscale = d3.scaleLinear()
    .domain(yearExtent)
    .range([margin, height - margin])

  const casualtyCount = d3.extent(yearlyDeaths, d => d.count)
  const yscale = d3.scaleLinear()
    .domain(casualtyCount)
    .range([height - margin, margin])

  // line generator
  const linegen = d3.line()
    .x(d => xscale(d.year)) // Use date here! 
    .y(d => yscale(d.count))
    .curve(d3.curveLinear)

  // Select the svg
  const svg = d3
    .select('#yearly-deaths')

  // Make a group for the graph
  const graph = svg
    .append('g')

  // Draw the graph
  graph
    .append('path')
    .attr('d', linegen(yearlyDeaths))
    .attr('stroke-width', 5)
    .attr('stroke', '#d62124')
    .attr('fill', 'none')

  // Create the axis
  const bottomAxis = d3.axisBottom(xscale).tickFormat(d3.format("d"))
  const leftAxis = d3.axisLeft(yscale)

  // Append a group and add the bottom axis 
  svg
    .append('g')
    // Position the group
    .attr('transform', `translate(0, ${height - margin})`)
    // generate the axis in the group
    .call(bottomAxis)

  // Append the group and add the left axis
  svg
    .append('g')
    .attr('transform', `translate(${margin}, 0)`)
    .call(leftAxis)

  // create the graph title
  svg.append("text")
    .attr("x", (width / 2))
    .attr("y", 0 + (margin / 2))
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style('font-family', "'Roboto', sans-serif")
    .text("Innocent Deaths Caused by Police by Location")
    .text("Yearly Fatal Encounters with U.S. Police");
    */