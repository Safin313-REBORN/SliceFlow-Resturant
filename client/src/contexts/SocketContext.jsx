import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [liveOrderEvent, setLiveOrderEvent] = useState(null);

  useEffect(() => {
    const isStaticHost =
      typeof window !== 'undefined' &&
      (window.location.hostname.includes('github.io') ||
       window.location.hostname.includes('pages.dev'));

    const socketUrl = import.meta.env.VITE_SOCKET_URL || (isStaticHost ? null : '/');

    if (!socketUrl) {
      // In static demo mode, simulate periodic status progression for active demo orders
      return;
    }

    const socketInstance = io(socketUrl, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true,
    });

    socketInstance.on('connect', () => {
      console.log('⚡ Socket.IO connected with id:', socketInstance.id);
    });

    socketInstance.on('order:status_updated', (eventData) => {
      console.log('🔔 Order status updated in real time:', eventData);
      setLiveOrderEvent(eventData);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user]);

  const joinOrderRoom = (orderId) => {
    if (socket && orderId) {
      socket.emit('join_order_room', orderId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, liveOrderEvent, joinOrderRoom }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

