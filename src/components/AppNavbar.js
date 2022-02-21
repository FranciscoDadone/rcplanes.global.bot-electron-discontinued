import React from 'react'
import { Navbar, Container, Offcanvas, Nav } from 'react-bootstrap'
import AppStatus from './AppStatus'


export default function AppNavbar() {
  return (
    <Navbar bg="dark" variant="dark" expand={false}>
      <Container fluid>
        <Navbar.Toggle aria-controls="offcanvasNavbar" />
        <Navbar.Brand href="#">rcplanes.global.bot (Instagram)</Navbar.Brand>
        <Navbar.Text>
          <AppStatus status="Idling..."/>
        </Navbar.Text>
        <Navbar.Offcanvas
          id="offcanvasNavbar"
          aria-labelledby="offcanvasNavbarLabel"
          placement="start"
        >
          <Offcanvas.Header closeButton>
            <Offcanvas.Title id="offcanvasNavbarLabel">Dashboard</Offcanvas.Title>
          </Offcanvas.Header>
          <Offcanvas.Body>
            <Nav className="justify-content-start flex-grow-1 pe-3">
              <Nav.Link href="#action1">Home</Nav.Link>
              <Nav.Link href="#action2">Link</Nav.Link>
            </Nav>
          </Offcanvas.Body>
        </Navbar.Offcanvas>
      </Container>
    </Navbar>
  )
}
