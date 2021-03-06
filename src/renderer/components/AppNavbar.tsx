import { useState } from 'react';
import { Navbar, Container, Nav } from 'react-bootstrap';
import { ipcRenderer, shell } from 'electron';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEarthAmerica,
  faGear,
  faDatabase,
  faList,
  faCircleInfo,
} from '@fortawesome/free-solid-svg-icons';
import AppStatus from './AppStatus';
import ExplorePage from './ExplorePage';
import ConfigurationPage from './ConfigurationPage';
import DatabasePage from './DatabasePage';
import QueuePage from './QueuePage';
import InfoPage from './InfoPage';
import appIcon from '../../../assets/images/icon.png';
import '../../../assets/css/AppNavbar.css';

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
          <Navbar.Brand
            className="navBrand"
            onClick={() =>
              shell.openExternal('https://www.instagram.com/rcplanes.global/')
            }
          >
            <img src={appIcon} alt="App icon" className="navbarBrand" />
            &nbsp;&nbsp;RcPlanesBot
          </Navbar.Brand>
          <div className="verticalLine" />
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0"
              style={{ maxHeight: '100px' }}
              navbarScroll
              variant="pills"
            >
              <Nav.Link onClick={() => setComponent(<ExplorePage />)}>
                <FontAwesomeIcon icon={faEarthAmerica} />
                &nbsp;Explore
              </Nav.Link>
              <Nav.Link onClick={() => setComponent(<ConfigurationPage />)}>
                <FontAwesomeIcon icon={faGear} />
                &nbsp;Configuration
              </Nav.Link>
              <Nav.Link onClick={() => setComponent(<DatabasePage />)}>
                <FontAwesomeIcon icon={faDatabase} />
                &nbsp;Database
              </Nav.Link>
              <Nav.Link onClick={() => setComponent(<QueuePage />)}>
                <FontAwesomeIcon icon={faList} />
                &nbsp;Queue
              </Nav.Link>
              <Nav.Link onClick={() => setComponent(<InfoPage />)}>
                <FontAwesomeIcon icon={faCircleInfo} />
                &nbsp;Info
              </Nav.Link>
            </Nav>
            <Navbar.Text>
              <AppStatus status={Status} />
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div
        style={{
          marginTop: '4rem',
          backgroundColor: '#282c34',
          color: 'white',
        }}
      >
        {Component}
      </div>
    </>
  );
}
