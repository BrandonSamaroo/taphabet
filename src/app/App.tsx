import { useState } from 'react'
import MainMenu from '../main-menu/MainMenu';
import CreateRoom from '../create-room/CreateRoom';
import Game from '../game/Game';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route path="/create-room" element={<CreateRoom />} />
        <Route path="/play/:roomId" element={<Game />} />
      </Routes>
    </Router>
  );
}
