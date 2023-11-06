import React, { ChangeEvent, useState } from 'react'
import socket from '../../socket';

function SubmitUser() {
    const [name, setName] = useState<string>("");

    const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleSubmitName = () => {
        socket.emit('submit_name', name);
        socket.connect();
    };
    return (<>
        <p>select pic</p>
        <input
            type="text"
            value={name}
            onChange={handleNameChange}
            placeholder="Enter your name"
        />
        <p></p>
        <button onClick={handleSubmitName}>Submit</button>
    </>)
}

export default SubmitUser