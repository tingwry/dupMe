import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import Countdown from './Countdown';
import './Room.css'

function Pianov2() {
    const allnotes = ["C", "D", "E", "F", "G", "A", "B"];
    const [notelist, setNotelist] = useState<{ id: number; note: string }[]>([]);
    const [notelistReceived, setNotelistReceived] = useState<{ id: number; note: string }[]>([]);
    const [round, setRound] = useState(1);

    const [createDuration, setCreateDuration] = useState(5);
    const [isCreating, setIsCreating] = useState(false);
    const [followDuration, setFollowDuration] = useState(7);
    const [isFollowing, setIsFollowing] = useState(false);

    // Click note
    const handleClickNote = (item: string) => {
        if (isCreating || isFollowing) {
            const newNote = { id: notelist.length, note: item };
            const updatedNotelist = [...notelist, newNote]; //Add in array
            setNotelist(updatedNotelist);
            socket.emit('send_notelist', { notelist: updatedNotelist });
        }
    };

    const startCreate = () => {
        setNotelist([]);
        setNotelistReceived([]);
        setIsCreating(true);
    }

    const startFollow = () => {
        setNotelist([]);
        setIsFollowing(true);
    }

    const endCreate = () => {
        socket.emit('end_create');
        setIsCreating(false);
    }

    const endFollow = () => {
        socket.emit('end_follow', { arrayReceived: notelistReceived, arraySubmit: notelist });
        setIsFollowing(false);
        setNotelist([]);
        setNotelistReceived([]);
    }
    
    const endTurn = () => {
        socket.emit('end_turn', { arrayReceived: notelistReceived, arraySubmit: notelist });
        setIsFollowing(false);
        setNotelist([]);
        setNotelistReceived([]);
    };

    useEffect(() => {
        // Starting the game after both are ready
        socket.on('start_game', (data) => {
        setNotelist([]);
        setNotelistReceived([]);
        setIsCreating(true);
        });

        socket.on('start_turn', (data) => {
        setNotelist([]);
        setNotelistReceived([]);
        setIsCreating(true);
        });

        socket.on('next_round', (data) =>{
        setRound(data.round);
        setNotelist([]);
        setNotelistReceived([]);
        });

        socket.on('start_follow', () => {
        setNotelist([]);
        console.log('start_follow');
        setIsFollowing(true);
        });
        
        socket.on('receive_notelist', (data) => {
            setNotelistReceived(data.notelist);
        });

    }, [socket]);

    return (
        <>
            <p>Create a pattern:
            <Countdown
                key={`create_${round}`}
                duration={createDuration}
                running={isCreating}
                onTimeout={endCreate}
            />
            </p>

            <p>Follow the pattern: 
            <Countdown
                key={`follow_${round}`}
                duration={followDuration}
                running={isFollowing}
                onTimeout={endTurn}
            />
            </p>

            <div className="piano-container">
                {allnotes.map((item) => (
                    <div
                        key={item}
                        onClick={() => {handleClickNote(item);}}
                    >
                        <div>{item}</div>
                    </div>
                ))}
            </div>

            <h3>Display</h3>
            <div>
                {notelist.map((item) => (
                    <div className="display-note" key={item.id}>
                        {item.note}
                    </div>
                ))}
            </div>            

            <h3>Received</h3>
            <div>
                {!isFollowing && (<>
                    {notelistReceived.map((item) => (
                    <div className="display-note" key={item.id}>
                        {item.note}
                    </div>
                ))}</>)
                
                }
                
            </div>
        </>
    )
}

export default Pianov2