export function isNumeric(num) {
  return !isNaN(num)
}

export function isColor(x) {
  let s = new Option().style
  s.color = x
  let test1 = s.color === x
  let test2 = /^#[0-9A-F]{6}$/i.test(x)
  return (test1 === true || test2 === true)
}

export function isSpace(c) {
  return (c === ' ') || (c === '\t');
}

export function divideByTokens(str) {
  let result = [];
  let last = "";
  for (let i in str) {
    let c = str[i];
    if (isSpace(c)) {
      if (last !== "") {
        result.push(last);
      }
      last = "";
    } else {
      last += c;
    }
  }
  if (last !== "") {
    result.push(last);
  }
  return result;
}

function getRGB(v) {
  let el = document.createElement("div");
  el.style["background-color"] = v;
  document.body.appendChild(el);

  let style = window.getComputedStyle(el);
  let color = style["backgroundColor"];
  document.body.removeChild(el);

  return color;
}

function parseColor(color) {
  let arr = [];
  color.replace(/[\d+\.]+/g, function (v) {
    arr.push(parseFloat(v));
  });
  return "#" + arr.slice(0, 3).map(toHex).join("");
}

function toHex(int) {
  let hex = int.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function lightenColor(color, amt = 30) {
  if (color.charAt(0) !== '#') {
    color = parseColor(getRGB(color));
  }

  let cur = color.charAt(0) === '#' ? color.substring(1, 7) : color;

  let r = Math.max(Math.min(255, parseInt(cur.substring(0, 2), 16) + amt), 0).toString(16)
  let g = Math.max(Math.min(255, parseInt(cur.substring(2, 4), 16) + amt), 0).toString(16)
  let b = Math.max(Math.min(255, parseInt(cur.substring(4, 6), 16) + amt), 0).toString(16)

  return `#${r}${g}${b}`
}