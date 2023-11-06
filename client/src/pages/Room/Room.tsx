import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import Status from "../../components/Status/Status";
import Piano from "../../components/Piano/Piano";

import './Room.css'
import PlayerA from "../../components/Player/PlayerA";
import PlayerB from "../../components/Player/PlayerB";

function Room() {
    return (<>
        <h2>Room</h2>
        <div className='player-container'>
            <div className='playerA'>
                <PlayerA />
            </div>
            <div className='status'><Status /></div>
            <div className='playerB'>
                <PlayerB />
            </div>
            <div className='piano'><Piano /></div>
        </div>
    </>)
}

export default Room