import React from 'react'

import '../assets/css/App.css'
import AppNavbar from './AppNavbar'


const { ipcRenderer } = require('electron')


function a() {
  ipcRenderer.send('anything-asynchronous', 'ping')
}

function App() {
  return (
    <>

      <AppNavbar />

    <div>


    </div>
    </>
  )
}

export default App
