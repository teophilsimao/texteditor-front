import React, {useEffect, useState} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMessage } from '../modell/editorUtils';

const UserResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [token, setToken] = useState('');
    const { error, setError, message, setMessage } = useMessage();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {

        const query = new URLSearchParams(location.search);
        const theEmail = query.get('email')
        setToken(query.get('token'));

        if (theEmail ) {
            setEmail(theEmail);
        }
    }, [location.search]);
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = 'http://localhost:9000/reset-password';
        const userData = { email, newPassword: password, token };

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
                setMessage('Password changed, login now!');
            } else {
                const errorData = await response.json();
                setError(errorData.errors?.detail || 'Something went wrong');
            }
        } catch (error) {
            const errorMsg = await error.text();
            setError(`Error: ${errorMsg}`);
            console.error(error);
        }
    };

    return (
        <div>
            <h2>Change Password</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {message && <p style={{ color: 'green' }}>{message}</p>}
            {!message && (
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
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type='submit'>Change Password</button>
            </form>
            )}
            <button onClick={() => navigate('/')}>
                Click here to login
            </button>
        </div>
    );
};

export default UserResetPassword;
