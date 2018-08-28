/* global Image */
class Tracer {
  constructor (canvas, imageUrl) {
    this.canvas = canvas
    this.canvas.height = 512
    this.canvas.width = 1024
    this.context = canvas.getContext('2d')
    this.imageUrl = imageUrl
    this.image = new Image()
    this.imageData = null
    this.traceMap = null
    this.origin = [353.6166145066524, 90.93290618541266]
    this.rayDensity = 256
    this.fov = 90
    this.rayLength = 2
    this.raySpace = this.fov / this.rayDensity
    this.rotation = 619
  }
  load () {
    this.image.onload = this.trace.bind(this)
    this.image.src = this.imageUrl
    this.context.imageSmoothingEnabled = false
    this.context.drawImage(this.image, 0, 0, 512, 512)
    this.imageData = this.context.getImageData(0, 0, 512, 512)
  }
  trace () {
    this.context.fillStyle = '#fff'
    this.context.fillRect(512, 0, 512, 512)
    for (let i = 0; i < this.rayDensity; i++) {
      this.traceLine(i)
    }
    this.circle(this.origin[0], this.origin[1])
  }
  traceLine (i) {
    let length = this.rayLength
    let space = this.raySpace
    let angle = ((-this.fov / 2) + (i * space) + this.rotation) % 360 * (Math.PI / 180)
    let direction = [Math.sin(angle) * length, Math.cos(angle) * length]
    let j = (Math.floor(this.origin[1] + direction[1]) * 512 + Math.floor(this.origin[0] + direction[0])) * 4

    let normal = [0, 0]

    while ((this.imageData.data[j] + this.imageData.data[j + 1] + this.imageData.data[j + 2]) / 3 >= 255) {
      length += this.rayLength
      direction = [Math.sin(angle) * length, Math.cos(angle) * length]
      j = (Math.floor(this.origin[1] + direction[1]) * 512 + Math.floor(this.origin[0] + direction[0])) * 4
    }

    let up = (Math.floor(this.origin[1] + direction[1] + 2) * 512 + Math.floor(this.origin[0] + direction[0])) * 4
    let dw = (Math.floor(this.origin[1] + direction[1] - 2) * 512 + Math.floor(this.origin[0] + direction[0])) * 4
    let lf = (Math.floor(this.origin[1] + direction[1]) * 512 + Math.floor(this.origin[0] + direction[0] - 2)) * 4
    let rt = (Math.floor(this.origin[1] + direction[1]) * 512 + Math.floor(this.origin[0] + direction[0] + 2)) * 4

    let upv = (this.imageData.data[up] + this.imageData.data[up + 1] + this.imageData.data[up + 2]) / 3 >= 255
    let dwv = (this.imageData.data[dw] + this.imageData.data[dw + 1] + this.imageData.data[dw + 2]) / 3 >= 255
    let lfv = (this.imageData.data[lf] + this.imageData.data[lf + 1] + this.imageData.data[lf + 2]) / 3 >= 255
    let rtv = (this.imageData.data[rt] + this.imageData.data[rt + 1] + this.imageData.data[rt + 2]) / 3 >= 255

    if (upv) normal = [1, 0]
    if (dwv) normal = [-1, 0]
    if (lfv) normal = [0, -1]
    if (rtv) normal = [0, 1]

    let normdeg = Math.round(Math.abs(Math.atan2(normal[0] - direction[0], normal[1] - direction[1]) * (180 / Math.PI)) / 180 * 4)

    this.drawScreen(i, length, normdeg, this.imageData.data[j], this.imageData.data[j + 1], this.imageData.data[j + 2])

    if (i === 0 || i === this.rayDensity - 1) {
      this.context.beginPath()
      this.context.moveTo(this.origin[0], this.origin[1])
      this.context.lineTo(this.origin[0] + direction[0], this.origin[1] + direction[1])
      this.context.strokeStyle = `rgb(${this.imageData.data[j]}, ${this.imageData.data[j + 1]}, ${this.imageData.data[j + 2]})`
      this.context.stroke()
      this.context.closePath()
    }
  }
  drawScreen (i, length, normal, r, g, b) {
    this.context.fillStyle = `rgb(${r * (normal / 4)}, ${g * (normal / 4)}, ${b * (normal / 4)})`
    this.context.fillRect(512 + (512 - (i * (this.canvas.width / 2 / this.rayDensity))), length / 2, 1 * (this.canvas.width / 2 / this.rayDensity), 512 - length)
  }
  circle (x, y) {
    this.context.beginPath()
    this.context.arc(x, y, 4, 0, 2 * Math.PI)
    this.context.fillStyle = 'red'
    this.context.fill()
    this.context.closePath()
  }
}
