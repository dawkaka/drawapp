import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import Side from "./components/side"
import Canvas from "./components/board"

function App() {


  return (
    <div className="App">
      <Side />
      <Canvas />
    </div>
  )
}

export default App
