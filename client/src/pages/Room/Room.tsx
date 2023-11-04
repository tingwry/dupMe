import { useNavigate } from "react-router-dom";
import socket from "../../socket";
import Status from "../../components/Status/Status";
import Piano from "../../components/Piano/Piano";

import './Room.css'

function Room() {
    const navigate = useNavigate();
    const handleLeave = () => {
        socket.emit('leave_room');
        // console.log("leave_room");
        navigate('/')
    };
    return (<>
        <h2>Room</h2>
        <button onClick={handleLeave}>leave this room</button>

        <div className='player-container'>
            <div className='playerA'>
                <div>name a</div>
                <div>pic a</div>
                <div>score a</div>
                <div>trophy a</div>
            </div>
            <div className='status'><Status /></div>
            <div className='playerB'>
                <div>name b</div>
                <div>pic b</div>
                <div>score b</div>
                <div>trophy b</div>
            </div>
            <div className='piano'><Piano /></div>
        </div>
    </>)
}

export default Room