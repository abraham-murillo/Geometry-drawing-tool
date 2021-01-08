import React from "react";

const SCALE = 20

export function initXYAxis(props) {
  const {ctx, canvas} = props

  ctx.fillStyle = '#FFFFFF'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  // x-axis
  ctx.fillStyle = '#000000'
  ctx.fillRect(canvas.width / 2, 0, 1, canvas.height)

  // y-axis
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, canvas.height / 2, canvas.width, 1)
}

export function drawPoint(props) {
  // point x y color
  const {ctx, canvas, obj} = props

  if (obj.length < 3)
    return

  const x = SCALE * parseInt(obj[1]) + canvas.width / 2
  const y = -SCALE * parseInt(obj[2]) + canvas.height / 2
  const color = obj.length >= 4 ? obj[3] : 'black'

  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, 3, 0, 2 * Math.PI)
  ctx.fill()
}

export function drawLine(props) {
  // const {ctx, x, y} = info
  // const {color = 'black'} = style
  
  // ctx.fillStyle = color;
  // ctx.beginPath()
  // ctx.arc(x, y, 20 * Math.sin(6 * 0.05) ** 2, 0, 2 * Math.PI)
  // ctx.fill()
}

export function drawSegment(props) {
  // seg x1 y1 x2 y2 color
  const {ctx, canvas, obj} = props

  if (obj.length < 5)
    return

  const x1 = SCALE * parseInt(obj[1]) + canvas.width / 2
  const y1 = -SCALE * parseInt(obj[2]) + canvas.height / 2
  const x2 = SCALE * parseInt(obj[3]) + canvas.width / 2
  const y2 = -SCALE * parseInt(obj[4]) + canvas.height / 2
  const color = obj.length >= 5 ? obj[5] : 'black'

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.strokeStyle = color;
  ctx.stroke()
}

export function drawCircle(props) {
  // circle x y radio color
  const {ctx, canvas, obj} = props

  if (obj.length < 4)
    return

  const x = SCALE * parseInt(obj[1]) + canvas.width / 2
  const y = -SCALE * parseInt(obj[2]) + canvas.height / 2
  const r = SCALE * parseInt(obj[3])
  const color = obj.length >= 4 ? obj[4] : 'black'

  ctx.strokeStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.stroke()
}

