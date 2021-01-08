import React from "react";

const SCALE = 15

export function initXYAxis(props) {
  const { ctx, canvas } = props

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
  const { ctx, canvas, obj } = props

  if (obj.length < 3)
    return

  const x = SCALE * parseFloat(obj[1]) + canvas.width / 2
  const y = -SCALE * parseFloat(obj[2]) + canvas.height / 2
  const color = obj.length >= 4 ? obj[3] : 'black'

  ctx.fillStyle = color;
  ctx.beginPath()
  ctx.arc(x, y, 4, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = 'black';
}

export function drawLine(props) {
  // line x1 y1 x2 y2 color
  const { ctx, canvas, obj } = props

  if (obj.length < 5)
    return

  const x1 = SCALE * parseFloat(obj[1]) + canvas.width / 2
  const y1 = -SCALE * parseFloat(obj[2]) + canvas.height / 2
  const x2 = SCALE * parseFloat(obj[3]) + canvas.width / 2
  const y2 = -SCALE * parseFloat(obj[4]) + canvas.height / 2
  const color = obj.length >= 5 ? obj[5] : 'black'

  const dirx = x2 - x1
  const diry = y2 - y1

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.lineWidth = 2.5;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + dirx * canvas.width, y1 + diry * canvas.height);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - dirx * canvas.width, y1 - diry * canvas.height);
  ctx.stroke()
  ctx.strokeStyle = 'black';
}

export function drawSegment(props) {
  // seg x1 y1 x2 y2 color
  const { ctx, canvas, obj } = props
  console.log(obj)

  if (obj.length < 5)
    return

  const x1 = SCALE * parseFloat(obj[1]) + canvas.width / 2
  const y1 = -SCALE * parseFloat(obj[2]) + canvas.height / 2
  const x2 = SCALE * parseFloat(obj[3]) + canvas.width / 2
  const y2 = -SCALE * parseFloat(obj[4]) + canvas.height / 2
  const color = obj.length >= 5 ? obj[5] : 'black'

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.lineWidth = 2.5;
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke()
  ctx.strokeStyle = 'black';
}

export function drawCircle(props) {
  // circle x y radio color
  const { ctx, canvas, obj } = props

  if (obj.length < 4)
    return

  const x = SCALE * parseFloat(obj[1]) + canvas.width / 2
  const y = -SCALE * parseFloat(obj[2]) + canvas.height / 2
  const r = SCALE * parseFloat(obj[3])
  const color = obj.length >= 4 ? obj[4] : 'black'

  ctx.strokeStyle = color;
  ctx.beginPath()
  ctx.lineWidth = 2.5;
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.strokeStyle = 'black';
}

export function drawPolygon(props) {
  // poly x1 y1 x2 y2 ... xn yn color
  const { ctx, canvas, obj } = props

  if (obj.length < 5)
    return

  const poly = []
  for (let i = 1; i < obj.length - 1; i += 2) {
    const x = SCALE * parseFloat(obj[i]) + canvas.width / 2
    const y = -SCALE * parseFloat(obj[i + 1]) + canvas.height / 2
    poly.push({ x, y })
  }

  console.log(poly)
  const color = obj.length % 2 == 0 && poly.length >= 1 ? obj[obj.length - 1] : 'black'

  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  for (let i = 0; i < poly.length; i++) {
    ctx.fillStyle = color;
    ctx.beginPath()
    ctx.arc(poly[i].x, poly[i].y, 4, 0, 2 * Math.PI)
    ctx.fill()
  
    let j = (i + 1) % poly.length
    ctx.beginPath();
    ctx.moveTo(poly[i].x, poly[i].y);
    ctx.lineTo(poly[j].x, poly[j].y);
    ctx.stroke()
  }
  ctx.strokeStyle = 'black';
}
