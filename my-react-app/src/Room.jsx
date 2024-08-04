import  { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Room.css';
import { useRoomContext } from './RoomContext.jsx';
import { useNavigate } from 'react-router-dom';
import io from 'socket.io-client';

function Room() {
  const navigate = useNavigate();
  const { roomName, setRoomName, userName, setUserName, messages, setMessages } = useRoomContext();
  const [newMessage, setNewMessage] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const socket = io('https://socketio.ahmads.dev');  
    setSocket(socket);

    socket.on('connect', () => {
      console.log('Connected to Socket.IO server');
      socket.emit('join', { room: roomName, user: userName });
    });

    socket.on('message', (data) => {
      setMessages(prevMessages => [
        ...prevMessages,
        { text: data.message, sender: data.user, date: data.date }
      ]);
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from Socket.IO server');
    });

    return () => socket.disconnect();
  }, [roomName, userName]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (socket) {
      socket.emit('message', {
        message: newMessage,
        user: userName,
        room: roomName
      });
      setNewMessage('');
    }
  };

  const handleRefresh = (e1, e2) => {
    const formData = { roomName: e1, userName: e2 };

    axios.post('https://chatapi.ahmads.dev/api/checkroom', formData)
      .then(response => {
        const messages = response.data.messages || [];
        setMessages(messages.map(msg => ({ text: msg.value, sender: msg.user, date: msg.date })));
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
    handleRefresh(storedRoomName, storedUserName);
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
              <p>{message.text}</p>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
        <div className='send-msg'>
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className='msg'
              required
              placeholder='Write a message'
            />
            <button type='submit' className='send'>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Room;
