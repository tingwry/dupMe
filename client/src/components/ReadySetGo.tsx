import React, { useEffect, useState } from 'react'

interface Props {
    running: boolean;
    onTimeout: () => void; 
}

function ReadySetGo({ running, onTimeout }: Props) {
    const [count, setCount] = useState(3);
    const [text, setText] = useState('Ready');

    useEffect(() => {
        if (running) {
            const interval = setInterval(() => {
                setCount((prevCount) => prevCount - 1);
            }, 1000);

            return () => {
                clearInterval(interval);
            };
        }
        
    }, [running]);

    useEffect(() => {
        if (count === 0) {
            setText('Your turn');
            onTimeout();
        } else if (count === 1) {
            setText("Go");
        } else if (count === 2) {
            setText("Set");
        }
      }, [count]);

    return (
        <div>{text}</div>
    )
}

export default ReadySetGo