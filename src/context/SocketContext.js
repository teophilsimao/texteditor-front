import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { io } from 'socket.io-client';

const SocketContext = createContext();

export const useSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
    const [socket, setSocket] = useState(null);

    const connectSocket = useCallback((token) => {
        if (socket) return;

        const newSocket = io('http://localhost:9000', { auth: { token } });

        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Socket connected with ID:', newSocket.id);
        });

        return () => {
            newSocket.disconnect();
            console.log('Socket disconnected');
        };
    }, [socket]);

    const disconnectSocket = useCallback(() => {
        if (socket) {
            socket.disconnect();
            console.log('Socket disconnected');
            setSocket(null);
        }
    }, [socket]);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token ) {
            connectSocket(token);
        }

        return () => {
            disconnectSocket();
        };
    }, [connectSocket, disconnectSocket]);

    return (
        <SocketContext.Provider value={{ socket, connectSocket, disconnectSocket }}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketProvider;
