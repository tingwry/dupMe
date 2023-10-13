import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";
// import SendMessage from "./components/SendMessage";
import Piano from "./components/Piano";

import { io } from "socket.io-client";
import JoinRoom from "./components/JoinRoom";
import User from "./components/User";


function App() {
  return (
    <div className="App">
      <JoinRoom />
      <User />
    </div>
  );
}

export default App;
