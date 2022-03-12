const D3Node = require('d3-node')

function drawGraph(data) {
    const d3n = new D3Node()
    const svg = d3n.createSVG(400, 900)

    svg.append("line")
        .attr("x1", 100)
        .attr("x2", 500)
        .attr("y1", 50)
        .attr("y2", 50)
        .attr("stroke", "black")

    console.log(d3n.svgString())

    const imgBuffer = Buffer.from(
        '<svg><rect x="0" y="0" width="200" height="200" rx="50" ry="50"/></svg>',
    );

    return imgBuffer
}

module.exports = drawGraph