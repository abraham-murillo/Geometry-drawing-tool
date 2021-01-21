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

    this.goToOrigin = this.goToOrigin.bind(this)
  }

  componentDidMount() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    ctx.clearRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height);

    ctx.fillStyle = 'white'
    ctx.fillRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height)
    ctx.rect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height);

    if (this.props.showGrid) {
      ctx.fillStyle = drawGrid({deltaX: 10, deltaY: 10, color: '#606060', scale: this.state.scale})
      ctx.fill()

      ctx.fillStyle = drawGrid({deltaX: 100, deltaY: 100, color: 'black', scale: this.state.scale})
      ctx.fill()
    }
  }

  goToOrigin() {
    this.setState(() => {
      return {
        x: 0,
        y: 0,
        marginLeft: 0, 
        marginTop: 0,
      }
    })
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    
    ctx.clearRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height);

    // if (this.props.goToOrigin) {
    //   this.goToOrigin()
    //   this.props.keepMoving()
    // }
    
    ctx.fillStyle = 'white'
    ctx.fillRect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height)
    ctx.rect(-this.state.marginLeft, -this.state.marginTop, canvas.width, canvas.height);

    if (this.props.showGrid) {
      ctx.fillStyle = drawGrid({deltaX: 10, deltaY: 10, color: '#606060', scale: this.state.scale})
      ctx.fill()

      ctx.fillStyle = drawGrid({deltaX: 100, deltaY: 100, color: 'black', scale: this.state.scale})
      ctx.fill()
    }
  
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
      let newScale = prevState.scale + event.deltaY * -deltaScale;
      newScale = Math.min(500, Math.max(1, newScale))

      return {
        scale: newScale
      }
    })
  }

  onMouseUp(event) {
    event.preventDefault()

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
        ctx.translate(deltaX, deltaY);

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
        <canvas width="600" height="600" 
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


