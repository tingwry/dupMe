import React, { useEffect, useState } from 'react'

interface Props {
    onTimeout: () => void; 
}

function ReadySetGo({ onTimeout }: Props) {
    const [count, setCount] = useState(3);
    const [text, setText] = useState('Ready');

    useEffect(() => {
        const interval = setInterval(() => {
            setCount((prevCount) => prevCount - 1);
        }, 1000);
    
        return () => {
            clearInterval(interval);
        };
    }, []);

    useEffect(() => {
        if (count === 0) {
            setText('Go');
        } else if (count < 0) {
            setText('Nothing here');
        } else {
            setText(count === 3 ? 'Ready' : 'Set');
        }
      }, [count]);


    return (
        <div>{text}</div>
    )
}

export default ReadySetGo