import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
    const navigate = useNavigate();
  
    const handleLogout = () => {

      localStorage.removeItem('token');
      navigate('/');
    };
  
    return (
      <button onClick={handleLogout}>Logout</button>
    );
};

export default LogoutButton;