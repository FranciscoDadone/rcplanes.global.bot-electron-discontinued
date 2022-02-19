import React from 'react'

import '../assets/css/App.css'

const { ipcRenderer } = require('electron')


function a() {

  ipcRenderer.send('anything-asynchronous', 'ping')

}

function App() {
  return (
    <div>
      <h1>Hello, Electron!</h1>

      <button onClick={a}>Hello</button>

    </div>
  )
}

export default App
