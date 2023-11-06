import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import SelectRoom from '../../components/SelectRoom/SelectRoom'
import SubmitUser from '../../components/SubmitUser/SubmitUser';

function Home() {
    const [isConnected, setIsConnected] = useState<boolean>(socket.connected);

    const [name, setName] = useState<string>();
    const [avatar, setAvatar] = useState<string>();

    const [users, setUsers] = useState<{sid: string, name: string, roomId: string, score: number, ready: boolean, P1: boolean}[]>([]);

    useEffect(() => {
        socket.on('connect', () => {
          setIsConnected(true);
        });
    
        socket.on('disconnect', () => {
          setIsConnected(false);
        });

        socket.on('profile', (data) => {
            setName(data.name);
            setAvatar(data.avatar);
        })

        socket.on('users', (data) => {
            setUsers(data);
        })
    }, [socket]);

    return (<>
        <h1>WELCOME!</h1>
        {isConnected ? (
            <>
                <img
                    // style={{ width: "100px", height: "100px", flexWrap: "wrap" }}
                    className='avatar'
                    src={avatar}
                    alt="Profile"
                />
                <div className='name'>{name}</div>
                <p>current players: {users.length}</p>
                {users.map((item) => (
                    <div key={item.sid}>
                        {item.name}, {item.roomId}
                    </div>
                ))}
                <SelectRoom />
            </>
        ) : (
            <SubmitUser />
        )}
    </>)
}

export default Home