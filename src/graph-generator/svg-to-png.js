const { createCanvas, loadImage } = require('canvas')

function svgToPng(svg, width, height) {
    const canvas = createCanvas(width, height)
    canvas.getContext('2d').drawImage(svg, 0, 0);

    const buf = canvas.toBuffer()

    return buf
}

module.exports = svgToPng