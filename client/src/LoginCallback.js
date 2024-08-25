import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    const roomId = new URLSearchParams(window.location.search).get('state');
    const userType = "host";

    if (code && roomId) {
        console.log('Navigating to room:', roomId, 'with code:', code);
        navigate(`/host/${roomId}`, { state: { code, userType } });  // Passing code via state object
    } else {
      console.error('Invalid code or room ID in LoginCallback');
    }
  }, [navigate]);

  return <div>Redirecting...</div>;
}
