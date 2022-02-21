import React from 'react'
import '../assets/css/AppNavbar.css'
import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'

export default function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark">
    <Container>
      <Navbar.Brand href="#">rcplanes.global.bot (Instagram)</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>
          Status: Idle
        </Navbar.Text>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}
