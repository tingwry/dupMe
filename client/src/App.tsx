import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
// import SendMessage from "./components/SendMessage";
import Piano from "./components/Piano";

import { io } from "socket.io-client";

const socket = io("http://localhost:3000");

function App() {
  return (
    <div className="App">
      <Piano />
    </div>
  );
}

export default App;
