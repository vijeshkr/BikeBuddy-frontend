import io from 'socket.io-client';
const backendUrl = import.meta.env.VITE_BACKEND_URL;

const socket = io(backendUrl, { transports: ['websocket'] });

export default socket;