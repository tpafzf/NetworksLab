import openSocket from 'socket.io-client';
const socket = openSocket('http://localhost:17477');

function subscribeToChatRoom(interval, cb) {
    socket.on('new message', timestamp => cb(null, timestamp));
} 
export { subscribeToChatRoom }