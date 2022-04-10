import {isNumeric, isColor, lightenColor} from "./Stuff";

const LineWidth = 0.4
const Smallest = 4
const Biggest = 5

function getX(props) {
  const { x, canvas, scale } = props
  return scale * parseFloat(x) + canvas.width / 2
}

function getY(props) {
  const { y, canvas, scale } = props
  return -scale * parseFloat(y) + canvas.height / 2
}

export function drawGrid(props) {
  // This don't scale itself :c
  const { deltaX, deltaY, color, scale } = props

  const canvas = document.createElement("canvas")
  const ctx = canvas.getContext('2d')

  canvas.width = deltaX
  canvas.height = deltaY
  // ctx.fillStyle = 'white'

  ctx.strokeStyle = color
  ctx.moveTo(0, 0);
  ctx.lineTo(deltaX * scale, 0)
  ctx.stroke()

  ctx.moveTo(0, 0)
  ctx.lineTo(0, deltaY * scale)
  ctx.stroke()
  return ctx.createPattern(canvas, 'repeat')
}

function drawTextAt(props) {
  const { ctx, canvas, text, x, y, scale, color } = props

  let fontSize = Math.min(20, Math.max(18, scale))

  ctx.font = fontSize + "px Comic Sans MS";
  ctx.fillStyle = color;
  ctx.fillText(text, x + 10, y + 10);
}

export function drawText(props) { 
  // Lets see how useful you are
  const { ctx, canvas, obj, scale, defaultColor } = props

  const text = " " + obj[0] + " "
  const x = getX({ x: obj[1], canvas, scale })
  const y = getY({ y: obj[2], canvas, scale })
  const color = obj.length >= 4 ? obj[3] : defaultColor

  drawTextAt({ ctx, canvas, text, x, y, scale, color })
}

export function drawPoint(props) {
  const { ctx, canvas, obj, scale, defaultColor } = props

  if (obj.length < 3)
    return

  const x = getX({ x: obj[1], canvas, scale })
  const y = getY({ y: obj[2], canvas, scale })

  let color = defaultColor
  let text = ""
  if (obj.length >= 4) {
    if (isColor(obj[3])) {
      color = obj[3]
      if (obj.length >= 5)
        text = obj[4]
    } else {
      text = obj[3]
    }
  } 
  
  ctx.fillStyle = lightenColor(color);
  ctx.strokeStyle = 'black';
  ctx.beginPath()
  const r = Math.max(Smallest, Math.min(Biggest, scale * LineWidth)) * 1.3
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.fill()
  
  drawTextAt({ ctx, canvas, text, x, y, scale, color })
}

export function drawLine(props) {
  const { ctx, canvas, obj, scale, defaultColor } = props

  if (obj.length < 5)
    return

  const x1 = getX({ x: obj[1], canvas, scale })
  const y1 = getY({ y: obj[2], canvas, scale })
  const x2 = getX({ x: obj[3], canvas, scale })
  const y2 = getY({ y: obj[4], canvas, scale })

  let color = defaultColor
  let text = ""
  if (obj.length >= 6) {
    if (isColor(obj[5])) {
      color = obj[5]
      if (obj.length >= 7)
        text = obj[6]
    } else {
      text = obj[5]
    }
  } 

  const inf = 100000
  const k = Math.hypot(x2 - x1, y2 - y1)
  const dirx = (x2 - x1) / k
  const diry = (y2 - y1) / k

  ctx.strokeStyle = lightenColor(color);
  ctx.beginPath();
  ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, scale * LineWidth))
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 + dirx * inf, y1 + diry * inf);
  ctx.moveTo(x1, y1);
  ctx.lineTo(x1 - dirx * inf, y1 - diry * inf);
  ctx.stroke()

  drawTextAt({ ctx, canvas, text, x: (x1 + x2) / 2, y: (y1 + y2) / 2, scale, color })
}

export function drawSegment(props) {
  const { ctx, canvas, obj, scale, defaultColor } = props

  if (obj.length < 5)
    return

  const x1 = getX({ x: obj[1], canvas, scale })
  const y1 = getY({ y: obj[2], canvas, scale })
  const x2 = getX({ x: obj[3], canvas, scale })
  const y2 = getY({ y: obj[4], canvas, scale })
  
  let color = defaultColor
  let text = ""
  if (obj.length >= 6) {
    if (isColor(obj[5])) {
      color = obj[5]
      if (obj.length >= 7)
        text = obj[6]
    } else {
      text = obj[5]
    }
  } 

  ctx.strokeStyle = lightenColor(color);
  ctx.beginPath();
  ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, scale * LineWidth))
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke()

  drawTextAt({ ctx, canvas, text, x: (x1 + x2) / 2, y: (y1 + y2) / 2, scale, color })
}

export function drawCircle(props) {
  const { ctx, canvas, obj, scale, defaultColor } = props

  if (obj.length < 4)
    return

  const x = getX({ x: obj[1], canvas, scale })
  const y = getY({ y: obj[2], canvas, scale })
  const r = scale * parseFloat(obj[3])

  let color = defaultColor
  let text = ""
  if (obj.length >= 5) {
    if (isColor(obj[4])) {
      color = obj[4]
      if (obj.length >= 6)
        text = obj[5]
    } else {
      text = obj[4]
    }
  }

  ctx.strokeStyle = lightenColor(color);
  ctx.beginPath()
  ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, scale * LineWidth))
  ctx.arc(x, y, r, 0, 2 * Math.PI)
  ctx.stroke()

  drawTextAt({ ctx, canvas, text, x: x + r, y, scale, color })
}

export function drawPolygon(props) {
  const { ctx, canvas, obj, scale, defaultColor } = props

  if (obj.length < 5)
    return

  const poly = []
  let rightMost = { x: -100000000, y: -100000000 }
  for (let i = 1; i < obj.length - 1; i += 2) 
    if (isNumeric(obj[i]) && isNumeric(obj[i + 1])) {
      const x = getX({ x: obj[i], canvas, scale })
      const y = getY({ y: obj[i + 1], canvas, scale })
      poly.push({ x, y })
      
      if (x > rightMost.x)
        rightMost = { x: x, y: y }
    }

  let color = defaultColor
  let text = ""
  if (2 * poly.length + 1 < obj.length) {
    if (isColor(obj[2 * poly.length + 1])) {
      color = obj[2 * poly.length + 1]  // for sure its the color
      if (obj.length - 1 !== 2 * poly.length + 1) 
        text = obj[obj.length - 1] // text to write if isn't the color
    } else {
      text = obj[2 * poly.length + 1] // is it text?
    }
  }

  ctx.strokeStyle = lightenColor(color);
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

  drawTextAt({ ctx, canvas, text, x: rightMost.x, y: rightMost.y, scale, color })
}
