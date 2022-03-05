import { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { ipcRenderer } from 'electron';
import AppStatus from './AppStatus';
import ExplorePage from './ExplorePage';
import ConfigurationPage from './ConfigurationPage';
import DatabasePage from './DatabasePage';

export default function AppNavbar() {
  const [Status, setStatus] = useState('Booting up...');
  const [Component, setComponent] = useState(<ExplorePage />);

  ipcRenderer.on('status', (_event, newStatus) => {
    setStatus(newStatus);
  });

  return (
    <>
      <Navbar bg="dark" variant="dark" fixed="top" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">rcplanes.global</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
              variant="pills"
            >
              <Nav.Link onClick={() => setComponent(<ExplorePage />)}>
                Explore
              </Nav.Link>
              <Nav.Link onClick={() => setComponent(<ConfigurationPage />)}>
                Configuration
              </Nav.Link>
              <Nav.Link onClick={() => setComponent(<DatabasePage />)}>
                Database
              </Nav.Link>
            </Nav>
            <Navbar.Text>
              <AppStatus status={Status} />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ marginTop: '4rem' }}>{Component}</div>
    </>
  );
}
