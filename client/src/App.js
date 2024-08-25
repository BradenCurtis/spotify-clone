import React from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import UserTypeSelection from './UserTypeSelection';
import EnterRoom from './EnterRoom';
import Login from './Login';
import HostDashboard from './HostDashboard'; 
import LoginCallback from './LoginCallback'; 
import GuestDashboard from './GuestDashboard';

const RoomWithDashboard = () => {
  const location = useLocation();
  const code = location.state?.code;
  const userType = location.state?.userType;

  return <HostDashboard code={code} userType={userType}/>;
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<UserTypeSelection />} />
      <Route path="/enter-room" element={<EnterRoom />} />
      <Route path="/host/:roomId" element={<RoomWithDashboard />} />
      <Route path="/join/:roomId" element={<GuestDashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/logincallback" element={<LoginCallback />} />
    </Routes>
  );
};

export default App;
