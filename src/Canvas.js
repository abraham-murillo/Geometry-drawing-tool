import React, { useRef, useState, useEffect } from "react";
import { draw } from "./Geometry";
import { isNumeric, isColor } from "./Stuff";
import "./styles.css"

export default function Canvas(props) {
  const [state, setState] = useState({
    scale: 20,
    dragging: false,
    x: 0,
    y: 0,
    marginLeft: 0,
    marginTop: 0,
  });

  const canvasRef = useRef();

  function restartScale() {
    setState((prev) => ({
      ...prev,
      scale: 20,
      dragging: false,
      x: 0,
      y: 0,
    }));
    props.restartScaleDone();
  }

  function goToOrigin() {
    // console.log("go to origin");
    // console.log(state);
    const ctx = canvasRef.current.getContext('2d');
    props.goToOriginDone();
  }

  function prepareCanvas() {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(-state.marginLeft, -state.marginTop, canvas.width, canvas.height)

    ctx.fillStyle = '#f6f6fc'
    ctx.fillRect(-state.marginLeft, -state.marginTop, canvas.width, canvas.height)
    ctx.rect(-state.marginLeft, -state.marginTop, canvas.width, canvas.height)

    // if (props.showGrid) {
    //   // ctx.fillStyle = drawGrid({ deltaX: state.scale, deltaY: state.scale, color: '#606060', scale: 100 })
    //   // ctx.fill()

    //   // ctx.fillStyle = drawGrid({deltaX: 1000, deltaY: 1000, color: 'black', scale: state.scale})
    //   // ctx.fill()
    // }
  }

  function drawObjects() {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Draws all objects again
    let currentColor = "black";
    let showVertices = false;
    props.objects.forEach((element) => {
      let data = [...element];

      if (isColor(data[0])) {
        currentColor = data[0]
        return;
      }

      if (currentColor === "transparent") {
        return;
      }

      if (data.length === 1 && data[0] === "showVertices") {
        showVertices = true;
        return;
      }

      // Use some "intelligence" to know what's going on
      if (isNumeric(data[0])) {
        if (data.length >= 2 && isNumeric(data[1])) {
          if (data.length >= 3 && isNumeric(data[2])) {
            if (data.length >= 3 && isNumeric(data[3])) {
              // 4 numeric values, so for me it is a 'poly' of 2 sides :D
              data.unshift('poly')
            } else {
              // 3 numeric values, so for me it is a circle
              data.unshift('circle')
            }
          } else {
            // 2 numeric values, so for me it is a point
            data.unshift('point')
          }
        } else {
          // idk what is this
        }
      }

      // They especify the type
      if (data.length < 3)
        return; // not ready yet 

      const type = data[0]
      data.shift();

      draw({
        type: type,
        ctx: ctx,
        canvas: canvas,
        data: data,
        scale: state.scale,
        defaultColor: currentColor,
        showVertices: showVertices
      });
    });

    ctx.restore();
  }

  useEffect(() => {
    if (props.restartScale) {
      restartScale();
    }
    if (props.goToOrigin) {
      goToOrigin();
    }
    prepareCanvas();
    drawObjects();
  }, [
    props.goToOrigin,
    props.restartScale,
    props.objects,
    state.dragging, state.scale,
    state.x, state.y]);

  function zoomInOut(event) {
    const deltaScale = 0.01

    setState((prev) => {
      let newScale = prev.scale + event.deltaY * -deltaScale
      newScale = Math.min(500, Math.max(1, newScale))

      return ({
        ...prev,
        scale: newScale
      })
    })
  }

  function onMouseUp(event) {
    setState((prev) => ({
      ...prev,
      dragging: false
    }))
  }

  function onMouseMove(event) {
    const ctx = canvasRef.current.getContext('2d')

    setState((prevState) => {
      let curState = prevState

      if (curState.dragging) {
        let deltaX = event.clientX - prevState.x
        let deltaY = event.clientY - prevState.y

        curState.marginLeft += deltaX
        curState.marginTop += deltaY
        ctx.translate(deltaX, deltaY)

        curState.x = event.clientX
        curState.y = event.clientY
      }

      return ({
        ...prevState,
        ...curState
      })
    })
  }

  function onMouseDown(event) {
    setState((prev) => ({
      ...prev,
      dragging: true,
      x: event.clientX,
      y: event.clientY,
    }))
  }

  return (
    <canvas
      width="1000" height="800"
      className="image"
      ref={canvasRef}
      onWheel={zoomInOut}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp} />
  );
}