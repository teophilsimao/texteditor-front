import React from 'react';
import { useNavigate } from 'react-router-dom';

const UserVerified = () => {
    const navigate = useNavigate();

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Email Verified!</h1>
            <p>Your email has been successfully verified. You can now log in.</p>
            <button onClick={() => navigate('/')}>Go to Login</button>
        </div>
    );
};

export default UserVerified;
