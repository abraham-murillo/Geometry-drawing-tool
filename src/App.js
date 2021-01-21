import React, { Component } from 'react';
import ReactDOM from "react-dom"

import Canvas from "./Canvas";
import "./styles.css"
import "./button.css"

class App extends Component {
  constructor() {
    super()

    this.state = {
      objects: [],
      showGrid: true,
      goToOrigin: false,
    }
  }

  getInput(event) {
    this.setState(() => {
      const text = event.target.value

      const newObjects = text.split('\n').map((line) => {
        const bySpaces = line.split(' ')

        function isGood(props) {
          const {c} = props
          if ('0' <= c && c <= '9') 
            return true;
          if ('a' <= c && c <= 'z') 
            return true;
          if ('A' <= c && c <= 'Z') 
            return true;
          return c == '.' || c == '-' || c == '+' || c == '#'
        }
        
        let properties = []
        for (const [pos, toClean] of bySpaces.entries()) {
          properties.push("")
          for (const c of toClean) {
            if (isGood({c}))
              properties[properties.length - 1] += c
          }
        }

        // console.log(properties)

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

  goToOriginButton(event) {
    this.setState(() => {
      return {
        goToOrigin: true
      }
    })
  }

  restartGoToOrigin() {
    this.setState(() => {
      return {
        goToOrigin: false
      }
    })
  }

  render() {
    return (
      <div>
        <div className="multi-button">
          <button>Geometry noob version</button>

          <button onClick={this.goToOriginButton.bind(this)} >
            Go to origin
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
            >
          </textarea>

          <Canvas objects={this.state.objects} 
                  showGrid={this.state.showGrid} 
                  goToOrigin={this.state.goToOrigin} 
                  restartGoToOrigin={this.restartGoToOrigin.bind(this)} />
        </div>
      </div>
    )
  }
}

export default App;
