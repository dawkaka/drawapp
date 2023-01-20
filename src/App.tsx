import { useState } from 'react'
import { Provider } from "jotai"
import './App.css'
import Side from "./components/side"
import Canvas from "./components/board"

function App() {
  return (
    <Provider>
      <div className="App">
        <Side />
        <Canvas />
      </div>
    </Provider>
  )
}

export default App
