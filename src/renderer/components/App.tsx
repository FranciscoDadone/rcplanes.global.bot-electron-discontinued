import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom';
import '../../../assets/css/App.css';
import AppNavbar from './AppNavbar';
import Configuration from './Configuration';
import Explore from './Explore';

function App() {
  return (
    <>
      {/* <BrowserRouter>
        <Routes>
          <Route path="/" element={<Explore />} />
          <Route path="/configuration" element={<Configuration />} />
        </Routes>
      </BrowserRouter> */}
      <AppNavbar />
    </>
  );
}

export default App;
