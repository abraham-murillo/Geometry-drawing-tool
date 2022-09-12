import { isNumeric, isColor, lightenColor } from "./Stuff";

const LINE_WIDTH = 0.4
const SMALL = 4
const BIG = 5
const INF = 100000

export function draw(objectProps) {
  const { type, ctx, canvas, data, scale, defaultColor } = objectProps;

  function drawTextAt(text, x, y, color) {
    if (text.length > 0) {
      // console.log("drawTextAt");

      if (color !== "transparent") {
        let fontSize = Math.min(20, Math.max(18, scale))
        ctx.font = fontSize + "px Comic Sans MS";
        ctx.fillStyle = color;
        ctx.fillText(text, x + 10, y + 10);
      }
    }
  }

  function drawPoint(x, y, color, text = "") {
    // console.log("drawPoint");

    if (color !== "transparent") {
      ctx.fillStyle = lightenColor(color);
      ctx.strokeStyle = 'black';
      ctx.beginPath()
      const r = Math.max(SMALL, Math.min(BIG, scale * LINE_WIDTH)) * 1.3
      ctx.arc(x, y, r, 0, 2 * Math.PI)
      ctx.fill();

      drawTextAt(text, x, y, color);
    }
  }

  function drawLine(x1, y1, x2, y2, color, text = "") {
    // console.log("drawLine");

    if (color !== "transparent") {
      const k = Math.hypot(x2 - x1, y2 - y1);
      const dirX = (x2 - x1) / k;
      const dirY = (y2 - y1) / k;
      ctx.strokeStyle = lightenColor(color);
      ctx.beginPath();
      ctx.lineWidth = Math.max(SMALL, Math.min(BIG, scale * LINE_WIDTH))
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 + dirX * INF, y1 + dirY * INF);
      ctx.moveTo(x1, y1);
      ctx.lineTo(x1 - dirX * INF, y1 - dirY * INF);
      ctx.stroke();

      drawTextAt(text, (x1 + x2) / 2, (y1 + y2) / 2, color);
    }
  }

  function drawSegment(x1, y1, x2, y2, color, text = "") {
    // console.log("drawSegment");

    if (color !== "transparent") {
      ctx.strokeStyle = lightenColor(color);
      ctx.beginPath();
      ctx.lineWidth = Math.max(SMALL, Math.min(BIG, scale * LINE_WIDTH))
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      drawTextAt(text, (x1 + x2) / 2, (y1 + y2) / 2, color);
    }
  }

  function drawCircle(x, y, r, color, text = "") {
    // console.log("drawCircle");

    if (color !== "transparent") {
      ctx.strokeStyle = lightenColor(color);
      ctx.beginPath()
      ctx.lineWidth = Math.max(SMALL, Math.min(BIG, scale * LINE_WIDTH))
      ctx.arc(x, y, r, 0, 2 * Math.PI)
      ctx.stroke();

      drawTextAt(text, x + r + 1, y, color);
    }
  }

  function drawPolygon(polygon, color, text = "") {
    // console.log("drawPolygon");

    if (color !== "transparent") {
      let rightMost = { x: -INF, y: -INF };
      for (let i = 0; i < polygon.length; i++) {
        let j = (i + 1) % polygon.length;
        drawSegment(polygon[i].x, polygon[i].y, polygon[j].x, polygon[j].y, color);
        drawPoint(polygon[i].x, polygon[i].y, color);

        if (polygon[i].x > rightMost.x)
          rightMost = polygon[i];
      }

      drawTextAt(text, rightMost.x, rightMost.y, color);
    }
  }

  function drawRectangle(x1, y1, x2, y2, color, text = "") {
    // console.log("drawRectangle");

    if (color !== "transparent") {
      const polygon = [{ x: x1, y: y1 }, { x: x1, y: y2 }, { x: x2, y: y2 }, { x: x2, y: y1 }];
      drawPolygon(polygon, color, text);
    }
  }

  function getX(x) {
    return scale * parseFloat(x) + canvas.width / 2
  }

  function getY(y) {
    return -scale * parseFloat(y) + canvas.height / 2
  }

  function getColor(properties) {
    let color = defaultColor;
    for (let x of properties)
      if (isColor(x))
        color = x;
    return color;
  }

  function getText(properties) {
    let text = "";
    for (let x of properties)
      if (!isColor(x))
        text += " " + x;
    return text;
  }

  if (type[0] === 'p') {
    if (type.endsWith("poly")) {
      const polygon = []
      for (let i = 0; i + 1 < data.length; i += 2)
        if (isNumeric(data[i]) && isNumeric(data[i + 1])) {
          const x = getX(data[i]);
          const y = getY(data[i + 1]);
          polygon.push({ x, y });
        }
      const color = getColor(data.slice(2 * polygon.length));
      const text = getText(data.slice(2 * polygon.length));

      drawPolygon(polygon, color, text);
    } else {
      const x = getX(data[0]);
      const y = getY(data[1]);
      const color = getColor(data.slice(2));
      const text = getText(data.slice(2));

      drawPoint(x, y, color, text);
    }
  } else if (type[0] === 'l') {
    const x1 = getX(data[0]);
    const y1 = getY(data[1]);
    const x2 = getX(data[2]);
    const y2 = getY(data[3]);
    const color = getColor(data.slice(4));
    const text = getText(data.slice(4));

    drawLine(x1, y1, x2, y2, color, text);
  } else if (type[0] === 's') {
    const x1 = getX(data[0]);
    const y1 = getY(data[1]);
    const x2 = getX(data[2]);
    const y2 = getY(data[3]);
    const color = getColor(data.slice(4));
    const text = getText(data.slice(4));

    drawSegment(x1, y1, x2, y2, color, text);
  } else if (type[0] === 'c') {
    const x = getX(data[0]);
    const y = getY(data[1]);
    const r = scale * parseFloat(data[2]);
    const color = getColor(data.slice(3));
    const text = getText(data.slice(3));

    drawCircle(x, y, r, color, text);
  } else if (type[0] === 'r') {
    const x1 = getX(data[0]);
    const y1 = getY(data[1]);
    const x2 = getX(data[2]);
    const y2 = getY(data[3]);
    const color = getColor(data.slice(4));
    const text = getText(data.slice(4));

    drawRectangle(x1, y1, x2, y2, color, text);
  }
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