import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import User from "./components/User";
import Score from "./components/Score";
import Welcome from "./pages/Welcome";
import { Route, Routes } from "react-router-dom";
import Room from "./pages/Room";


function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='/' element={ <Welcome /> } />
        <Route path='/room' element={ <Room /> } />
      </Routes>
      {/* <User /> */}
      {/* <Welcome/> */}
      {/* <Room /> */}
      {/* <Score /> */}
    </div>
  );
}

export default App;
