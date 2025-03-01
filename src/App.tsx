import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';

import Navbar from './pages/Navbar';
import MainMenu from './pages/MainMenu';
import CreateRoom from './pages/CreateRoom';
import Game from './pages/Game';
import { SessionUserProvider } from './context/SessionUserContext'; 

import 'react-toastify/dist/ReactToastify.css';

export default function App() {
  return (
    <Router>
      <SessionUserProvider>
        <Navbar />
        <div className='bg-gray-100 pt-30 h-screen'>
        <ToastContainer position="bottom-left" />
            <Routes>
            <Route path="/" element={<MainMenu />} />
            <Route path="/create-room" element={<CreateRoom />} />
            <Route path="/play/:roomId" element={<Game />} />
            </Routes>
        </div>
      </SessionUserProvider>
    </Router>
  );
}
