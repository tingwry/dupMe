import { io } from 'socket.io-client';

const socket = io((':3000'), {
    autoConnect: false
});

// const socket = io('http://localhost:3000');

export default socket;