import { useRoomContext } from './RoomContext'; 
import { useNavigate } from 'react-router-dom';
import './Home.css';
import axios from 'axios'

function Home() {
  const { roomName, setRoomName, userName, setUserName, setMessages } = useRoomContext();
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      roomName: roomName,
      userName: userName,
    };

    axios.post('https://chatapi.ahmads.dev/api/checkroom', formData)
      .then(response => {
        const messages = response.data.messages || []; 
        localStorage.setItem('roomName', roomName);
        localStorage.setItem('userName', userName);
       
        setMessages(messages.map(msg => ({ text: msg.value, sender: msg.user })));

        navigate(`/room/${roomName}/${userName}`);
      })
      .catch(error => {
        console.log('Error starting room:', error);
      });
  };

  return (
    <div className='home'>
      <h1>Welcome To The Chat Room</h1>
       <h4>Pick a room name and send it to your friend!</h4>
      <form onSubmit={handleSubmit} className='form'>
        <input type="text" placeholder='Room Name' required className='form-element' value={roomName} onChange={
          (e) => { setRoomName(e.target.value) }
        }/>
        <input type="text" placeholder='Your Name' required className='form-element' value={userName} onChange={
          (e) => { setUserName(e.target.value) }
        }/>
        <button type='submit' className='btn'>Start Room</button>
      </form>
    </div>
  );
}

export default Home;
