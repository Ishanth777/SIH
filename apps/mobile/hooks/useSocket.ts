import { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'https://localhost:3001/jobs'

export function useSocket(token?: string) {
    const socketRef = useRef<Socket | null>(null)
    const [isConnected, setIsConnected] = useState(false)

    useEffect(() => {
        socketRef.current = io(API_URL, {
            auth: { token },
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
            reconnectionDelayMax: 5000,
        });

        const socket = socketRef.current;
        socket.on('connect', () => setIsConnected(true));
        socket.on('disconnect', () => setIsConnected(false));
        socket.on('connect_error', (err: any) => console.error('Socket connect error:', err));
        return () => {
            socket.disconnect();
        };
    }, [token]);
    return { socket: socketRef.current, isConnected };
}
