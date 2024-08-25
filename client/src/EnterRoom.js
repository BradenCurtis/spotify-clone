// src/EnterRoom.js

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EnterRoom = () => {
  const [roomId, setRoomId] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    if (roomId) {
      navigate(`/join/${roomId}`);
    }
  };

  return (
    <div className="enter-room">
      <h1>Enter Room</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="room-id">Room ID:</label>
        <input
          id="room-id"
          type="text"
          value={roomId}
          onChange={(e) => setRoomId(e.target.value)}
          placeholder="Enter room ID"
        />
        <button type="submit">Enter</button>
      </form>
    </div>
  );
};

export default EnterRoom;
