import React, { useState } from 'react'
import socket from "../socket";

function CurrentUser() {
    const [users, setUsers] = useState<{sid: string, name: string, roomId: string, score: number, ready: boolean, P1: boolean}[]>([]);

    return (
        <>
            
        </>
    )
}

export default CurrentUser