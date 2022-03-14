const D3Node = require('d3-node')

function drawGraph(data, startDateString, endDateString) {
    const d3n = new D3Node()
    const d3 = d3n.d3

    const lineData = data
    
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
      .curve(d3.curveLinear);

    graphArea.append("path")
      .data([lineData])
      .attr("class", "line")
      .attr("d", valueline)
      .attr('stroke-width', 5)
      .attr('stroke', '#6495ED')
      .attr('fill', 'none');

    var xAxis_woy = d3.axisBottom(x).tickFormat(d3.timeFormat('%H:%M:%S'));

    graphArea.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis_woy);

    graphArea.append("g").call(d3.axisLeft(y));

    graphArea.selectAll(".dot")
      .data(lineData)
      .enter()
      .append("circle") // Uses the enter().append() method
      .attr("class", "dot") // Assign a class for styling
      .attr("cx", function (d) { return x(d.created_at) })
      .attr("cy", function (d) { return y(d.userIDs.length) })
      .attr("r", 3);  

    graphArea.selectAll(".text")
      .data(lineData)
      .enter()
      .append("text") // Uses the enter().append() method
      .attr("class", "label") // Assign a class for styling
      .attr("x", function (d, i) { return x(d.created_at) })
      .attr("y", function (d) { return y(d.userIDs.length) })
      .attr("dy", "-7")
      .text(function (d) { return d.userIDs.length; });

    svg.append('text')
      .attr('x', 30)
      .attr('y', 30) 
      .attr('font-size', '18px')
      .text(`Server activity from: ${startDateString} to ${endDateString}`); 

    return d3n.svgString()

} 

module.exports = drawGraph