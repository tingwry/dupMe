import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import Room from "./pages/Room/Room";
import Home from "./pages/Home/Home";
import Avatar from "./components/Avatar/Avatar";

function App() {
  return (
    <div className="App">
      <div className="tab">DupMe</div>
      <Avatar />
      {/* <Routes>
                <Route path='/' element={ <Home /> } />
                <Route path='/room' element={ <Room /> } />
            </Routes> */}
    </div>
  );
}

export default App;
