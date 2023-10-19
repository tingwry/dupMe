import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

import User from "./components/User";
import Score from "./components/Score";


function App() {
  return (
    <div className="App">
      <User />
      {/* <Score /> */}
    </div>
  );
}

export default App;
