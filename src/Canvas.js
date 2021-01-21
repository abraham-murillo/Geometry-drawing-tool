import React, { Component } from "react";
import { drawGrid, drawPoint, drawLine, drawSegment, drawCircle, drawPolygon } from "./Geometry";
import "./styles.css"

class Canvas extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()

    this.state = {
      scale: 10,
      dragging: false,
      x: 0,
      y: 0,
      marginLeft: 0, 
      marginTop: 0,
    }
  }

  componentDidMount() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    // Paint the xy-axisf
    ctx.fillStyle = 'white'
    ctx.clearRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height);

    ctx.fillStyle = drawGrid({deltaX: 10, deltaY: 10, color: '#606060', scale: this.state.scale})
    ctx.fill()

    ctx.fillStyle = drawGrid({deltaX: 100, deltaY: 100, color: 'black', scale: this.state.scale})
    ctx.fill()
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height);

    ctx.fillStyle = 'white'
    ctx.rect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height);

    ctx.fillStyle = drawGrid({deltaX: 10, deltaY: 10, color: '#606060', scale: this.state.scale})
    ctx.fill()

    ctx.fillStyle = drawGrid({deltaX: 100, deltaY: 100, color: 'black', scale: this.state.scale})
    ctx.fill()
  
    // Draws all objects again
    const objects = this.props.objects
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i]

      if (object.length < 3)
        continue // not ready yet 

      const type = object[0]
      const objectToDraw = {ctx, canvas, obj: object, scale: this.state.scale}

      switch (type[0]) {
        case 'p':
          if (type.endsWith("poly"))  
            drawPolygon(objectToDraw)
          else 
            drawPoint(objectToDraw)
          break;

        case 'l':
          drawLine(objectToDraw)
          break;

        case 's':
          drawSegment(objectToDraw)
          break;

        case 'c':
          drawCircle(objectToDraw)
          break;

        default:
          console.log("wtf bro!!")
          break;
      }
    }

    ctx.restore();
  }

  zoomInOut(event) {
    const deltaScale = 0.01

    this.setState((prevState) => {
      let curState = prevState

      curState.scale = prevState.scale + event.deltaY * -deltaScale;
      curState.scale = Math.min(500, Math.max(1, curState.scale))
      console.log(curState)

      return curState
    })
  }

  onMouseUp(event) {
    event.preventDefault()

    this.setState((prevState) => {
      let curState = prevState

      curState.dragging = false

      return curState
    })
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
        ctx.translate(deltaX, deltaY);

        curState.x = event.clientX
        curState.y = event.clientY
      }

      return curState
    })
  }

  onMouseDown(event) {
    this.setState((prevState) => {
      let curState = prevState
      
      curState.dragging = true
      curState.x = event.clientX
      curState.y = event.clientY
      
      return curState
    })
  }

  render() {
    return (
        <canvas width="600" height="500" 
                className="image" 
                ref={this.canvasRef} 
                onWheel={this.zoomInOut.bind(this)} 
                onMouseDown={this.onMouseDown.bind(this)} 
                onMouseMove={this.onMouseMove.bind(this)} 
                onMouseUp={this.onMouseUp.bind(this)} />
    )
  }  
}

export default Canvas


