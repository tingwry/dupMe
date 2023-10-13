import React, { useEffect, useState } from 'react'

interface Props {
    duration: number;
    onTimeout: () => void; 
    running: boolean;
}

function Countdown({ duration, running, onTimeout }: Props) {
    const [countdown, setCountdown] = useState(duration);

    useEffect(() => {
        if (running) {
            if (countdown === 0) {
                onTimeout();
            }
            const interval = setInterval(() => {
                setCountdown((prevCount) => {
                    if (prevCount <= 1) {
                        clearInterval(interval);
                        return 0;
                    };
                    return prevCount - 1;
                });
            }, 1000);
            return () => {
                clearInterval(interval);
            };
        }
        
    }, [running, countdown])

    return (
        <>{countdown}</>
    )
}

export default Countdown