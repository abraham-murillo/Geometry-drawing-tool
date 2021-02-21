import React, { Component } from 'react';
import ReactDOM from "react-dom"

import Canvas from "./Canvas";
import { divideByTokens, isSpace } from "./Stuff";
import "./styles.css"
import "./button.css"

class App extends Component {
  constructor() {
    super()

    this.state = {
      objects: [],
      showGrid: false,
      restartScale: false,
    }
  }

  getInput(event) {
    this.setState(() => {
      const text = event.target.value

      const newObjects = text.split('\n').map((line) => {
        function isGood(c) {
          if ('0' <= c && c <= '9')
            return true;
          if ('a' <= c && c <= 'z')
            return true;
          if ('A' <= c && c <= 'Z')
            return true;
          if (isSpace(c))
            return true
          return c == '.' || c == '-' || c == '+' || c == '#'
        }

        var cleanLine = ""
        for (const c of line)
          if (isGood(c))
            cleanLine += c

        const properties = divideByTokens(cleanLine)
        console.log(properties)

        return properties
      })

      return {
        objects: newObjects
      }
    })
  }

  showGridButton(event) {
    this.setState((prevState) => {
      return {
        showGrid: !prevState.showGrid
      }
    })
  }

  restartScale(event) {
    this.setState({ restartScale: true })
  }

  restartScaleDone() {
    this.setState({ restartScale: false })
  }

  render() {
    const text = 
    "  Geometry noob\n" +
    "[opt] means optional\n\n" +
    "Point:\n" +
    "[p] x y [color] [label]\n\n" +
    "Segment:\n" +
    "[s] x1 y1 x2 y2 [color] [label]\n\n" +
    "Line:\n" +
    "l x1 y1 x2 y2 [color] [label]\n\n" +
    "Circle:\n" +
    "[c] x y r [color] [label]\n\n" +
    "Polygon:\n" +
    "[poly] x1 y1 x2 y2 ... xn yn [color] [label]\n\n" +
    "Text:\n" +
    "text x y [color]\n\n"

    return (
      <div>
        <div className="multi-button">
          <button onClick={this.restartScale.bind(this)} >
            Restart scale
          </button>

          <button onClick={this.showGridButton.bind(this)}>
            {this.state.showGrid ? 'Hide' : 'Show'} grid
          </button>
        </div>

        <div>
          <textarea
            type="text"
            className="input"
            onChange={this.getInput.bind(this)}
            placeholder={text} />

          <Canvas 
            objects={this.state.objects}
            showGrid={this.state.showGrid}
            restartScale={this.state.restartScale}
            restartScaleDone={this.restartScaleDone.bind(this)} />
        </div>
      </div>
    )
  }
}

export default App;
