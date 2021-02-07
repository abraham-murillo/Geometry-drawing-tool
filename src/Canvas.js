import React, { Component } from "react";
import { drawText, drawGrid, drawPoint, drawLine, drawSegment, drawCircle, drawPolygon } from "./Geometry";
import { isNumeric } from "./Stuff";
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

    this.restartScale = this.restartScale.bind(this)
  }

  restartScale() {
    console.log("Restart go to origin Canvas")

    this.setState(() => {
      return {
        scale: 10,
        dragging: false,
        x: 0,
        y: 0,
      }
    })
  }

  prepareCanvas() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height)

    ctx.fillStyle = 'white'
    ctx.fillRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height)
    ctx.rect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height)

    if (this.props.showGrid) {
      ctx.fillStyle = drawGrid({deltaX: 10, deltaY: 10, color: '#606060', scale: this.state.scale})
      ctx.fill()

      ctx.fillStyle = drawGrid({deltaX: 100, deltaY: 100, color: 'black', scale: this.state.scale})
      ctx.fill()
    }
  }

  drawObjects() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    // Draws all objects again
    const objects = this.props.objects
    for (let i = 0; i < objects.length; i++) {
      const object = objects[i]

      // Use "some" intelligence to know what's going on
      if (isNumeric(object[0])) {   
        if (object.length >= 2 && isNumeric(object[1])) {
          if (object.length >= 3 && isNumeric(object[2])) {
            if (object.length >= 3 && isNumeric(object[3])) {
              // 4 numeric values, so for me it is a 'poly' of 2 sides :D
              object.unshift('poly')
            } else {
              // 3 numeric values, so for me it is a circle
              object.unshift('c')
            }
          } else {
            // 2 numeric values, so for me it is a point
            object.unshift('p')
          }
        } else {
          // idk what is this
        }
      }

      // They especify the type
      if (object.length < 3)
        continue // not ready yet 

      const type = object[0]
      const objectToDraw = {ctx, canvas, obj: object, scale: this.state.scale}

      if (type.length > 1 && !type.endsWith("poly")) {
        // A text object
        drawText(objectToDraw)
        continue
      }

      switch (type[0]) {
        case 'p':
          if (type.endsWith("poly"))  
            drawPolygon(objectToDraw)
          else 
            drawPoint(objectToDraw)
          break

        case 'l':
          drawLine(objectToDraw)
          break

        case 's':
          drawSegment(objectToDraw)
          break

        case 'c':
          drawCircle(objectToDraw)
          break

        default:
          console.log("wtf bro!!")
          break
      }
    }

    ctx.restore();
  }

  componentDidMount() {
    this.prepareCanvas()
  }

  componentDidUpdate() {
    if (this.props.restartScale) {
      this.restartScale()
      this.props.restartScaleDone()
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
    this.setState(() => {
      return {
        dragging: false
      }
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
        ctx.translate(deltaX, deltaY)

        curState.x = event.clientX
        curState.y = event.clientY
      }

      return curState
    })
  }

  onMouseDown(event) {
    this.setState(() => {
      return {
        dragging: true,
        x: event.clientX,
        y: event.clientY,
      }
    })
  }

  render() {
    return (
          <canvas width="1000" height="800" 
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


