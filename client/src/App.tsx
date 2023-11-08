import { useState } from "react";
import { Route, Routes, Link } from "react-router-dom";
import "./App.css";

import Room from "./pages/Room/Room";
import Home from "./pages/Home/Home";
import HowToPlay from "./components/HowToPlay";
import ChatRoom from "./components/ChatRoom/ChatRoom";

function App() {
  return (
    <div className="App">
      <div className="tab">DupMe</div>
      {/* <Avatar /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room" element={<Room />} />
        <Route path="/how-to-play" element={<HowToPlay />} />
        <Route path="/chat" element={<ChatRoom />} />
      </Routes>
    </div>
  );
}

export default App;
