import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Room.css';
import { useRoomContext } from './RoomContext.jsx';
import { useNavigate } from 'react-router-dom';

function Room() {
  const navigate = useNavigate();
  const { roomName, setRoomName, userName, setUserName, messages, setMessages } = useRoomContext();
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:8000/ws/chat/${roomName}/`);
    setSocket(ws);

    ws.onopen = () => {
        console.log('Connected to WebSocket server');
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages(prevMessages => [
            ...prevMessages,
            { text: data.message, sender: data.user }
        ]);
    };

    ws.onclose = () => {
        console.log('Disconnected from WebSocket server');
    };

    return () => ws.close();
}, [roomName]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (socket) {
      socket.send(JSON.stringify({
        message: newMessage,
        user: userName
      }));
      setNewMessage('');
    }
  };

  const handleRefresh = () => {
    const formData = {
      roomName: roomName,
      userName: userName,
    };

    axios.post('http://localhost:8000/api/checkroom', formData)
      .then(response => {
        const messages = response.data.messages || [];
        setMessages(messages.map(msg => ({ text: msg.value, sender: msg.user })));
      })
      .catch(error => {
        console.log('Error starting room:', error);
      });
  };

  useEffect(() => {
    const storedRoomName = localStorage.getItem('roomName');
    const storedUserName = localStorage.getItem('userName');

    if (storedRoomName) setRoomName(storedRoomName);
    if (storedUserName) setUserName(storedUserName);
    handleRefresh();
  }, [roomName]);

  const handleExit = () => {
    localStorage.clear();
    navigate(`/`);
  };

  return (
    <div className="container">
      <div className="header">
        {roomName}
        <button onClick={handleExit} className='e-btn'>Exit Room</button>
      </div>
      <div className="section">
        <div className="messages">
          {messages?.map((message, index) => (
            <div
              key={index}
              className={`message ${message.sender === userName ? 'you-msg' : 'other-msg'}`}
            >
              <span>{message.sender}</span>
              <br />
              {message.text}
            </div>
          ))}
        </div>
        <div className='send-msg'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className='msg'
              required
            />
            <button type='submit' className='send'>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Room;
