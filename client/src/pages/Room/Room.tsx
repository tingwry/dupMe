import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import Status from "../../components/Status/Status";
import Piano from "../../components/Piano/Piano";

import './Room.css'
import Me from "../../components/Player/Me";
import Opponent from "../../components/Player/Opponent";
import Pianov2 from "../../components/Piano/Pianov2";
import Statusv2 from "../../components/Status/Statusv2";
import Pianov3 from "../../components/Piano/Pianov3";
import Statusv3 from "../../components/Status/Statusv3";
import { useEffect, useState } from "react";

function Room() {
    const [room, setRoom] = useState("main")
    useEffect(() => {
        socket.on('in_room', (data) => {
            setRoom(data)
        })
    }, [socket])
    return (<>
        <h2>{room}</h2>
        <div className='player-container'>
            <div className='me'>
                <Me />
            </div>
            <div className='status'><Status /></div>
            <div className='opponent'>
                <Opponent />
            </div>
            <div className='piano'><Piano /></div>
        </div>
    </>)
}

export default Room