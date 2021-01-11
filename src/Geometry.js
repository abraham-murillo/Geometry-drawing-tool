import React from "react";

const LineWidth = 0.3 
const Smallest = 2.5
const Biggest = 3.5

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

function getX(props) {
  const { x, canvas, scale } = props
  return scale * parseFloat(x) + canvas.width / 2
}

function getY(props) {
  const { y, canvas, scale } = props
  return -scale * parseFloat(y) + canvas.height / 2
}

export function drawPoint(props) {
  // point x y color
  const { ctx, canvas, obj, scale } = props

  if (obj.length < 3)
    return

  const x = getX({x: obj[1], canvas, scale})
  const y = getY({y: obj[2], canvas, scale})
  const color = obj.length >= 4 ? obj[3] : 'black'

  ctx.fillStyle = color;
  ctx.beginPath() 
  const r = Math.max(Smallest, Math.min(Biggest, scale * LineWidth))
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
  ctx.strokeStyle = 'black';
}

export function drawLine(props) {
  // line x1 y1 x2 y2 color
  const { ctx, canvas, obj, scale } = props

  if (obj.length < 5)
    return

  const x1 = getX({x: obj[1], canvas, scale})
  const y1 = getY({y: obj[2], canvas, scale})
  const x2 = getX({x: obj[3], canvas, scale})
  const y2 = getY({y: obj[4], canvas, scale})
  const color = obj.length >= 5 ? obj[5] : 'black'

  const dirx = x2 - x1
  const diry = y2 - y1

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, scale * LineWidth))
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + dirx * canvas.width, y1 + diry * canvas.height);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - dirx * canvas.width, y1 - diry * canvas.height);
  ctx.stroke()
  ctx.strokeStyle = 'black';
}

export function drawSegment(props) {
  // seg x1 y1 x2 y2 color
  const { ctx, canvas, obj, scale } = props

  if (obj.length < 5)
    return

  const x1 = getX({x: obj[1], canvas, scale})
  const y1 = getY({y: obj[2], canvas, scale})
  const x2 = getX({x: obj[3], canvas, scale})
  const y2 = getY({y: obj[4], canvas, scale})
  const color = obj.length >= 5 ? obj[5] : 'black'

  ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, scale * LineWidth))
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke()
  ctx.strokeStyle = 'black';
}

export function drawCircle(props) {
  // circle x y radio color
  const { ctx, canvas, obj, scale } = props

  if (obj.length < 4)
    return

  const x = getX({x: obj[1], canvas, scale})
  const y = getY({y: obj[2], canvas, scale})
  const r = scale * parseFloat(obj[3])
  const color = obj.length >= 4 ? obj[4] : 'black'

  ctx.strokeStyle = color;
  ctx.beginPath()
  ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, scale * LineWidth))
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.stroke()
  ctx.strokeStyle = 'black';
}

export function drawPolygon(props) {
  // poly x1 y1 x2 y2 ... xn yn color
  const { ctx, canvas, obj, scale } = props

  if (obj.length < 5)
    return

  const poly = []
  for (let i = 1; i < obj.length - 1; i += 2) {
    const x = getX({x: obj[i], canvas, scale})
    const y = getY({y: obj[i + 1], canvas, scale})
    poly.push({ x, y })
  }

  const color = obj.length % 2 == 0 && poly.length >= 1 ? obj[obj.length - 1] : 'black'

  ctx.strokeStyle = color;
  ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, scale * LineWidth))
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
