import { io } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

class SocketService {
    constructor() {
        this.socket = null;
        this.eventCallbacks = {};
    }

    connect() {
        if (!this.socket) {
            this.socket = io(SOCKET_URL, {
                autoConnect: true,
                reconnection: true,
                reconnectionDelay: 1000,
                reconnectionAttempts: 5,
            });

            this.socket.on('connect', () => {
                console.log('✅ Socket connected:', this.socket.id);
            });

            this.socket.on('disconnect', () => {
                console.log('❌ Socket disconnected');
            });

            this.socket.on('error', (error) => {
                console.error('Socket error:', error);
            });
        }

        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
        }
    }

    subscribeToEvents(callback) {
        if (this.socket) {
            this.socket.emit('subscribe:events');
            this.socket.on('new_event', callback);
        }
    }

    unsubscribeFromEvents() {
        if (this.socket) {
            this.socket.emit('unsubscribe:events');
            this.socket.off('new_event');
        }
    }

    on(event, callback) {
        if (this.socket) {
            this.socket.on(event, callback);
        }
    }

    off(event, callback) {
        if (this.socket) {
            this.socket.off(event, callback);
        }
    }

    emit(event, data) {
        if (this.socket) {
            this.socket.emit(event, data);
        }
    }
}

const socketService = new SocketService();
export default socketService;
