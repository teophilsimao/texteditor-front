import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMessage } from '../modell/editorUtils';

const UserRequestReset = () => {
    const [email, setEmail] = useState('');
    const { error, setError, message, setMessage } = useMessage();
    const navigate = useNavigate();

    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = 'http://localhost:9000/request-reset-password';
        const userData = { email };

        try {
            const requestOptions = {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(userData),
            };

            const response = await fetch(url, requestOptions);
        
            if (response.ok) {
                setMessage('Please check your email to reset your password!');
            } else {
                const errorData = await response.json();
                setError(errorData.errors?.detail || 'Something went wrong');
            }
        } catch (error) {
            setError(`No user with the email ${ email }`);
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Register</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor='email'>Email:</label>
                    <input
                        type='email'
                        id='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <button type='submit'>Get a Reset link</button>
            </form>
            <button onClick={() => navigate('/')}>
                Click here to login
            </button>
            <button onClick={() => navigate('/register')}>
                Click here to register
            </button>
        </div>
    );
};

export default UserRequestReset;
