import React, { Component } from 'react';
import ReactDOM from "react-dom"

import Canvas from "./Canvas";
import "./styles.css"

class App extends Component {
  constructor() {
    super()

    this.state = {
      objects: []
    }

    this.getInput = this.getInput.bind(this)
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

  render() {
    return (
      <div>
        <h3>Geometry noob version</h3>

        <div>
          <textarea
            type="text"
            className="input"
            onChange={this.getInput}
            >
          </textarea>

          <Canvas objects={this.state.objects} />
        </div>
      </div>
    )
  }
}

export default App;
