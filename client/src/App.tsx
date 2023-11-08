import { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";

import Room from "./pages/Room/Room";
import Home from "./pages/Home/Home";
import socket from "./socket";

function App() {
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isConnected) {
            navigate('/');
        }
    }, [isConnected, navigate]);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });
    
        socket.on('disconnect', () => {
            setIsConnected(false);
        });
    }, [socket]);

    return (
        <div className="App">
            <div className="tab">DupMe</div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/room" element={<Room />} />
            </Routes>
        </div>
    );
}

export default App;
