import React, { useEffect, useState } from 'react'
import socket from '../../socket';
import { useNavigate, Link } from "react-router-dom";
import './Status.css'

function Status() {
    const [isReady, setIsReady] = useState(false); // data from the server
    const [playing, setPlaying] = useState(false);
    const [afterMatch, setIsAfterMatch] = useState(false);

    const [mode, setMode] = useState("Easy");
    
    const [time, setTime] = useState<any>();
    const [message, setMessage] = useState<string>();
    const [result, setResult] = useState<string>();
    
    const navigate = useNavigate();

    const handleLeave = () => {
        socket.emit('leave_room');
        navigate('/');
    };

    const handleReady = () => {
        socket.emit('ready');
        setIsReady(true);
    };

    const handleRestart = () => {
        socket.emit("client-restart");
      };
    
    const handleSurrender = () => {
        socket.emit("surrender");
    };

    const handleMode = (mode: string) => {
        if (mode === "Easy") {
            setMode("Hard");
            socket.emit('set_mode', "Hard");
        } else if (mode === "Hard") {
            setMode("Easy");
            socket.emit('set_mode', "Easy");
        }
    }

    useEffect(() => {
        socket.on('mode', (data) => {
            setMode(data.mode)
        });

        socket.on('turn', (data) => {
            setMessage(data.message)
        });

        socket.on('time', (data) => {
            setTime(data.time)
        });

        socket.on('start_game_server', () => {
            setPlaying(true);
            socket.emit('start_game_client');
        });

        socket.on('start_game', () => {
            setPlaying(true);
        });

        socket.on('end_game', (data) => {
            // combine tie and winner
            setPlaying(false);
            setIsAfterMatch(true);
            if (data.tie) {
                setResult('Tie !')
            } else {
                setResult(`The winner is ${data.winner}`)
            }
            console.log(data)
        });

        socket.on('restart', (data) => {
            setIsReady(false);
            setPlaying(false);
            setIsAfterMatch(false);
            setMessage("");
        });

    }, [socket]);

//   useEffect(() => {
//     socket.on("ready_state", (data) => {
//       setIsReady(data);
//     });

//     socket.on("start_turn", (data) => {
//       setPlaying(true);
//     });

//     socket.on("score", (data) => {
//       setScore(data);
//     });

//     // socket.on('tie', (data) => {
//     //     setTie(data);
//     // })

//     // socket.on('winner', (data) => {
//     //     console.log(data)
//     //     setWinner(data)
//     // })

//     socket.on("end_game", (data) => {
//       // combine tie and winner
//       setPlaying(false);
//       setIsAfterMatch(true);
//       if (data.tie) {
//         setTie(data.tie);
//         setResult("Tie !");
//       } else {
//         setWinner(data.winner);
//         setResult(`The winner is ${data.winner}`);
//       }
    //   console.log(data);
//     });

//     socket.on("restart", (data) => {
//       setPlaying(false);
//       setIsAfterMatch(false);
//     });
//   }, [socket]);

  return ( <> 
        <h3>{message}</h3>
        {playing ? (<>
            {/* <h3>{message}</h3> */}
            <h3>{time}</h3>
            <button onClick={handleSurrender}>Surrender</button>
        </>) : (<>
            {afterMatch ? (<>
                <button onClick={handleRestart}>Restart</button>
            </>) : (<>
                
                {isReady ? (<>
                    {/* <h3>{message}</h3> */}
                </>) : (<>
                    <button onClick={handleLeave}>Leave This Room</button>
                    <button
                        onClick={handleReady}
                        className={isReady ? "button-clicked" : "button-default"}
                    >
                        Ready
                    </button>
                    <p></p>
                    <button onClick={() => handleMode(mode)}>
                        {mode}
                    </button>
                </>)}
            </>)}
        </>)
        }
        
        {/* {isReady ? (<>
            <h3>{message}</h3>
            <h3>{time}</h3>
            <button onClick={handleSurrender}>surrender</button>
            <button onClick={handleRestart}>Restart</button>
        </>) : (<>
            <button onClick={handleLeave}>leave this room</button>
            <button
                onClick={handleReady}
                className={isReady ? "button-clicked" : "button-default"}
            >
                Ready
            </button>
            <button onClick={handleModeEasy}>Easy</button>
            <button onClick={handleModeHard}>Hard</button>
            <p>
                <Link to="/chat">
                    <button> Chat Room </button>
                </Link>
            </p>
        </>)}  */}
    </> );
}

export default Status;
