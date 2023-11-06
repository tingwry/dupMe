import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import Status from "../../components/Status/Status";
import Piano from "../../components/Piano/Piano";

import './Room.css'
import Me from "../../components/Player/Me";
import Opponent from "../../components/Player/Opponent";

function Room() {
    return (<>
        <h2>Room</h2>
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