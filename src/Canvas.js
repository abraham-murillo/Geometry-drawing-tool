import React, { Component } from "react";
import { drawGrid, drawAllObjects } from "./Geometry";
import { isNumeric, isColor } from "./Stuff";
import "./styles.css"

class Canvas extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()

    this.state = {
      scale: 20,
      dragging: false,
      x: 0,
      y: 0,
      marginLeft: 0,
      marginTop: 0,
    }

    this.restartScale = this.restartScale.bind(this)
  }

  restartScale() {
    this.setState(() => {
      return {
        scale: 20,
        dragging: false,
        x: 0,
        y: 0,
      }
    })
  }

  goToOrigin() {
    this.canvasRef = React.createRef()
    this.setState(() => {
      return {
        scale: 20,
        dragging: false,
        x: 0,
        y: 0,
        marginLeft: 0,
        marginTop: 0,
      }
    })
  }

  prepareCanvas() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height)

    ctx.fillStyle = '#f6f6fc'
    ctx.fillRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height)
    ctx.rect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height)

    if (this.props.showGrid) {
      // ctx.fillStyle = drawGrid(this.state.scale, this.state.scale, '#606060', 100)
      // ctx.fill()

      // ctx.fillStyle = drawGrid(1000, 1000, 'black', this.state.scale)
      // ctx.fill()
    }
  }

  mergePolygonPoints(rawObjects) {
    const objects = []
    for (const cur of rawObjects) {
      const prev = objects[objects.length - 1]

      if (cur.length == 0) {
        // next one is a new object
        objects.push(cur)
        continue
      }

      if (objects.length > 0 && prev.length > 0 && prev[0].startsWith("poly")) {
        objects[objects.length - 1] = prev.concat(cur)
      } else {
        objects.push(cur)
      }
    }

    return objects
  }

  assignObjectsType(rawObjects) {
    // Use "some" intelligence to know what's going on
    return rawObjects.map((cur) => {
      if (cur.length && isNumeric(cur[0])) {
        if (cur.length >= 2 && isNumeric(cur[1])) {
          if (cur.length >= 3 && isNumeric(cur[2])) {
            if (cur.length >= 4 && isNumeric(cur[3])) {
              // 4 numeric values, so for me it is a 'poly' of 2 sides :D
              cur.unshift('poly')
            } else {
              // 3 numeric values, so for me it is a circle
              cur.unshift('circle')
            }
          } else {
            // 2 numeric values, so for me it is a point
            cur.unshift('point')
          }
        } else {
          // idk what is this, just 1 value .-.
        }
      }

      return cur
    }).filter((cur) => {
      return cur.length > 0
    })
  }

  setAsObjects(rawObjects) {
    const objects = []

    let currentColor = "black"
    for (const cur of rawObjects) {
      if (isColor(cur[0])) {
        currentColor = cur[0]
        continue
      }

      if (cur.length < 3) {
        // object not ready yet 
        continue
      }

      const object = {
        type: cur[0],
        color: currentColor,
        arr: [],
        scale: this.state.scale,
        text: "",
      }

      for (let i = 1; i < cur.length; i++) {
        if (isColor(cur[i])) {
          object.color = cur[i]
        } else if (isNumeric(cur[i])) {
          object.arr.push(cur[i])
        } else {
          object.text += " " + cur[i]
        }
      }

      objects.push(object)
    }

    return objects
  }

  drawObjects() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    // Draws all objects again
    let objects = this.mergePolygonPoints(this.props.objects)
    objects = this.assignObjectsType(objects)
    objects = this.setAsObjects(objects)

    console.log(objects)

    drawAllObjects(ctx, canvas, objects)
  }

  componentDidMount() {
    this.prepareCanvas()
  }

  componentDidUpdate() {
    if (this.props.restartScale) {
      this.restartScale()
      this.props.restartScaleDone()
    }
    if (this.props.goToOrigin) {
      this.goToOrigin()
      this.props.goToOriginDone()
    }
    this.prepareCanvas()
    this.drawObjects()
  }

  zoomInOut(event) {
    const deltaScale = 0.01

    this.setState((prevState) => {
      let newScale = prevState.scale + event.deltaY * -deltaScale
      newScale = Math.min(500, Math.max(1, newScale))

      return {
        scale: newScale
      }
    })
  }

  onMouseUp(event) {
    this.setState({ dragging: false })
  }

  onMouseMove(event) {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    this.setState((prevState) => {
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

      return curState
    })
  }

  onMouseDown(event) {
    this.setState({
      dragging: true,
      x: event.clientX,
      y: event.clientY,
    })
  }

  render() {
    // console.log(this.props);

    return (
      <canvas
        width="1000" height="800"
        className="image"
        ref={this.canvasRef}
        onWheel={this.zoomInOut.bind(this)}
        onMouseDown={this.onMouseDown.bind(this)}
        onMouseMove={this.onMouseMove.bind(this)}
        onMouseUp={this.onMouseUp.bind(this)}
      />
    )
  }
}

export default Canvas


