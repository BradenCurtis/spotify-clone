import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserTypeSelection() {
  const navigate = useNavigate();

  const handleHostClick = () => {
    navigate('/login');
  };

  const handleGuestClick = () => {
    navigate('/enter-room');
  };

  return (
    <div>
      <h1>Select User Type</h1>
      <button onClick={handleHostClick}>Host</button>
      <button onClick={handleGuestClick}>Guest</button>
    </div>
  );
}
