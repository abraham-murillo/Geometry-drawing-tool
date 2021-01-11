import React, { Component } from "react";
import { initXYAxis, drawPoint, drawLine, drawSegment, drawCircle, drawPolygon } from "./Geometry";
import "./styles.css"

class Canvas extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = React.createRef()

    this.state = {
      scale: 15
    }

    this.zoomInOut = this.zoomInOut.bind(this)
  }

  componentDidMount() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    // Paint the xy-axis
    initXYAxis({ ctx, canvas })
  }

  componentDidUpdate() {
    const canvas = this.canvasRef.current
    const ctx = canvas.getContext('2d')

    // Reset all previous stuff
    ctx.save()
    ctx.beginPath()
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Paint the xy-axis
    initXYAxis({ ctx, canvas })

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
      newScale = Math.min(Math.max(.125, newScale), 30);

      return {
        scale: newScale
      }
    })
  }

  render() {
    return <canvas width="600" height="600" 
                  className="image" 
                  ref={this.canvasRef} 
                  onWheel={this.zoomInOut} />;
  }
}

export default Canvas


