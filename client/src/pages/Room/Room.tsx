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

function Room() {
    return (<>
        <h2>Room</h2>
        <div className='player-container'>
            <div className='me'>
                <Me />
            </div>
            <div className='status'><Statusv3 /></div>
            <div className='opponent'>
                <Opponent />
            </div>
            <div className='piano'><Pianov3 /></div>
        </div>
    </>)
}

export default Room