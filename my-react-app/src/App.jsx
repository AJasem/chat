import { RoomProvider } from './RoomContext'; 
import Home from './Home'; 
import Room from './Room'; 
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css'

function App() {
  return (
    <Router>
      <RoomProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomName/:userName" element={<Room />} />

        </Routes>
      </RoomProvider>
    </Router>
  );
}

export default App;
