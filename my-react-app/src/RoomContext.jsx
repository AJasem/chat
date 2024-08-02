import React, { createContext, useState, useContext } from 'react';

// Create a Context for the room and user information
const RoomContext = createContext();

// Create a provider component
export function RoomProvider({ children }) {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [messages, setMessages] = useState([])

  return (
    <RoomContext.Provider value={{ roomName, setRoomName, userName, setUserName, messages, setMessages }}>
      {children}
    </RoomContext.Provider>
  );
}

// Custom hook to use the RoomContext
export  function useRoomContext() {
  return useContext(RoomContext);
}
