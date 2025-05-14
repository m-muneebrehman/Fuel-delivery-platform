import { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAppStore } from '@/store';

// Create the context
const SocketContext = createContext(null);

// Socket.IO connection
let socket;

export const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);
  const { userInfo } = useAppStore();
  
  useEffect(() => {
    // Initialize socket connection
    const initializeSocket = () => {
      // Close previous connection if exists
      if (socket) {
        socket.disconnect();
      }
      
      // Create new connection
      socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3000', {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
      });
      
      // Connection event handlers
      socket.on('connect', () => {
        console.log('Socket connected:', socket.id);
        setIsConnected(true);
        
        // If user is logged in, join their room
        if (userInfo && userInfo._id) {
          joinUserRoom(userInfo);
        }
      });
      
      socket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });
      
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });
    };
    
    initializeSocket();
    
    // Cleanup on unmount
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []); // Empty dependency array to run only once
  
  // Join user's room when user logs in
  useEffect(() => {
    if (isConnected && userInfo && userInfo._id) {
      joinUserRoom(userInfo);
    }
  }, [isConnected, userInfo]);
  
  // Function to join user's room based on their type
  const joinUserRoom = (user) => {
    if (!socket || !user || !user._id) return;
    
    let userType = 'user';
    
    // Determine user type
    if (user.role === 'admin') {
      userType = 'admin';
    } else if (user.role === 'fuelPump') {
      userType = 'fuelPump';
    } else if (user.role === 'deliveryBoy') {
      userType = 'deliveryBoy';
    }
    
    // Join room with user ID and type
    socket.emit('join', {
      userId: user._id,
      userType: userType
    });
    
    console.log(`Joined ${userType} room with ID: ${user._id}`);
  };
  
  // Function to send a message to server
  const sendMessage = (eventName, data) => {
    if (!socket || !isConnected) {
      console.error('Cannot send message, socket not connected');
      return false;
    }
    
    try {
      socket.emit(eventName, data);
      return true;
    } catch (error) {
      console.error('Error sending message:', error);
      return false;
    }
  };
  
  // Function to listen for a specific event
  const subscribeToEvent = (eventName, callback) => {
    if (!socket) return () => {};
    
    socket.on(eventName, callback);
    
    // Return an unsubscribe function
    return () => {
      socket.off(eventName, callback);
    };
  };
  
  // Context value
  const contextValue = {
    isConnected,
    sendMessage,
    subscribeToEvent,
  };
  
  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

// Custom hook to use the socket context
export const useSocket = () => {
  const context = useContext(SocketContext);
  
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  
  return context;
}; 