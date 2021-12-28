import { isNumeric, isColor, lightenColor } from "./Stuff";

const Inf = 1e9
const LineWidth = 0.4
const Smallest = 4
const Biggest = 5

// export function drawGrid(deltaX, deltaY, color, scale) {
//   // This don't scale itself :c

//   const canvas = document.createElement("canvas")
//   const ctx = canvas.getContext('2d')

//   canvas.width = deltaX
//   canvas.height = deltaY
//   // ctx.fillStyle = 'white'

//   ctx.strokeStyle = color
//   ctx.moveTo(0, 0);
//   ctx.lineTo(deltaX * scale, 0)
//   ctx.stroke()

//   ctx.moveTo(0, 0)
//   ctx.lineTo(0, deltaY * scale)
//   ctx.stroke()
//   return ctx.createPattern(canvas, 'repeat')
// }

export function drawAllObjects(ctx, canvas, objects) {
  function getX(x, scale) {
    return scale * parseFloat(x) + canvas.width / 2
  }

  function getY(y, scale) {
    return -scale * parseFloat(y) + canvas.height / 2
  }

  function drawTextAt(x, y, text, scale, color) {
    if (text.length > 0) {
      let fontSize = Math.min(20, Math.max(18, scale))
      ctx.font = fontSize + "px Comic Sans MS";
      ctx.fillStyle = color;
      ctx.fillText(text, x + 10, y + 10);
    }
  }

  function drawPoint(object) {
    if (object.arr.length < 2)
      return

    const x = getX(object.arr[0], object.scale)
    const y = getY(object.arr[1], object.scale)

    ctx.fillStyle = lightenColor(object.color);
    ctx.strokeStyle = 'black';
    ctx.beginPath()
    const r = Math.max(Smallest, Math.min(Biggest, object.scale * LineWidth)) * 1.3
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.fill()

    drawTextAt(x, y, object.text, object.scale, object.color)
  }

  function drawLine(object) {
    if (object.arr.length < 4)
      return

    const x1 = getX(object.arr[0], object.scale)
    const y1 = getY(object.arr[1], object.scale)
    const x2 = getX(object.arr[2], object.scale)
    const y2 = getY(object.arr[3], object.scale)

    const k = Math.hypot(x2 - x1, y2 - y1)
    const dirx = (x2 - x1) / k
    const diry = (y2 - y1) / k

    ctx.strokeStyle = lightenColor(object.color);
    ctx.beginPath();
    ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, object.scale * LineWidth))
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 + dirx * Inf, y1 + diry * Inf);
    ctx.moveTo(x1, y1);
    ctx.lineTo(x1 - dirx * Inf, y1 - diry * Inf);
    ctx.stroke()

    drawTextAt((x1 + x2) / 2, (y1 + y2) / 2, object.text, object.scale, object.color)
  }

  function drawSegment(object) {
    if (object.arr.length < 4)
      return

    const x1 = getX(object.arr[0], object.scale)
    const y1 = getY(object.arr[1], object.scale)
    const x2 = getX(object.arr[2], object.scale)
    const y2 = getY(object.arr[3], object.scale)

    ctx.strokeStyle = lightenColor(object.color);
    ctx.beginPath();
    ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, object.scale * LineWidth))
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke()

    drawTextAt((x1 + x2) / 2, (y1 + y2) / 2, object.text, object.scale, object.color)
  }

  function drawCircle(object) {
    if (object.length < 3)
      return

    const x = getX(object.arr[0], object.scale)
    const y = getY(object.arr[1], object.scale)
    const r = object.scale * parseFloat(object.arr[2])

    if (r < 0) {
      console.log("Wtf with this circle?", x, y, r)
      return
    }

    ctx.strokeStyle = lightenColor(object.color);
    ctx.beginPath()
    ctx.lineWidth = Math.max(Smallest, Math.min(Biggest, object.scale * LineWidth))
    ctx.arc(x, y, r, 0, 2 * Math.PI)
    ctx.stroke()

    drawTextAt(x + r, y, object.text, object.scale, object.color)
  }

  function drawPolygon(object) {
    if (object.arr.length < 4)
      return

    let polygon = []
    let rightMost = [-Inf, -Inf]
    for (let i = 0; i + 1 < object.arr.length; i += 2)
      if (isNumeric(object.arr[i]) && isNumeric(object.arr[i + 1])) {
        polygon.push([object.arr[i], object.arr[i + 1]])

        if (object.arr[i] > rightMost[0]) {
          rightMost = polygon[polygon.length - 1]
        }
      }

    for (let i = 0; i < polygon.length; i++) {
      let j = (i + 1) % polygon.length

      const point = {
        color: object.color,
        arr: polygon[i],
        scale: object.scale,
        text: "",
      }

      const segment = {
        color: object.color,
        arr: [...polygon[i], ...polygon[j]],
        scale: object.scale,
        text: "",
      }

      drawPoint(point)
      drawSegment(segment)
    }

    drawTextAt(rightMost[0], rightMost[1], object.text, object.scale, object.color)
  }

  for (const object of objects) {
    switch (object.type[0]) {
      case 'p':
        if (object.type.endsWith("poly"))
          drawPolygon(object)
        else
          drawPoint(object)
        break

      case 'l':
        drawLine(object)
        break

      case 's':
        drawSegment(object)
        break

      case 'c':
        drawCircle(object)
        break

      default:
        console.log("wtf!")
        break
    }
  }

  ctx.restore();
}