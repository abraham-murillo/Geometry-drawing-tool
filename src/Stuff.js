export function isNumeric(num) {
  return !isNaN(num)
}

export function isColor(x){
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
  var result = [];
  var last = "";
  for (var i in str) {
    var c = str[i];
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
  var el = document.createElement("div");
  el.style["background-color"] = v;
  document.body.appendChild(el);

  var style = window.getComputedStyle(el);
  var color = style["backgroundColor"];
  document.body.removeChild(el);

  return color;
}

function parseColor(color) {
  var arr = []; 
  color.replace(/[\d+\.]+/g, function(v) { 
    arr.push(parseFloat(v));
  });
  return "#" + arr.slice(0, 3).map(toHex).join("");
}

function toHex(int) {
  var hex = int.toString(16);
  return hex.length === 1 ? "0" + hex : hex;
}

export function lightenColor(col, amt = 40) {
  if (col.charAt(0) !== '#') {
    col = parseColor(getRGB(col));
  }
  
  var cur = col.charAt(0) === '#' ? col.substring(1, 7) : col;
  
  var r = Math.max(Math.min(255, parseInt(cur.substring(0, 2), 16) + amt), 0).toString(16)
  var g = Math.max(Math.min(255, parseInt(cur.substring(2, 4), 16) + amt), 0).toString(16)
  var b = Math.max(Math.min(255, parseInt(cur.substring(4, 6), 16) + amt), 0).toString(16)
  
  const rr = (r.length < 2 ? '0' : '') + r
  const gg = (g.length < 2 ? '0' : '') + g
  const bb = (b.length < 2 ? '0' : '') + b
  return `#${rr}${gg}${bb}`
}