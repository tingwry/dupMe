import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import "./App.css";

import Room from "./pages/Room/Room";
import Home from "./pages/Home/Home";


function App() {
    return (
        <div className="App">
            <div className="tab">
                DupMe
            </div>
            {/* <Player /> */}
            <Routes>
                <Route path='/' element={ <Home /> } />
                <Route path='/room' element={ <Room /> } />
            </Routes>
        </div>
    );
}

export default App;
