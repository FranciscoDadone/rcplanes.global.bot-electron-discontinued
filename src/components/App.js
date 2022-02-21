import React from 'react'

import '../assets/css/App.css'

const { ipcRenderer } = require('electron')


function a() {
  ipcRenderer.send('anything-asynchronous', 'ping')
}

function App() {
  return (
    <div>
      

    </div>
  )
}

export default App
