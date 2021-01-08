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
      const newObjects = text.split('\n').map((str) => {
        return str.split(' ')
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
