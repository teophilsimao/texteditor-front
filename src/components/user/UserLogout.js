import React from "react";
import { useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";

const LogoutButton = () => {
    const navigate = useNavigate();
    const { disconnectSocket } = useSocket();
  
    const handleLogout = () => {
      disconnectSocket();
      localStorage.removeItem('token');
      navigate('/');
    };
  
    return (
      <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;