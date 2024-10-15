import React, {useState} from 'react';
import { useNavigate } from 'react-router-dom';

const UserLogin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [registered, setRegistered] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        const url = registered ? 'http://localhost:9000/register' : 'http://localhost:9000/login';
        const userData = { email, password };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Faild')
            }

            const data = await response.json();

            if (registered) {
                setMessage('Please check your email to verify your account. Once verified, you can log in.');
                setError('');
            } else {
                localStorage.setItem('token', data.data.token);
                navigate('/documents');
            }
        } catch (error) {
            setError('Failed to login/register. Please try again');
            console.error(error);
        }
    };

    return (
        <div>
            <h2>{registered ? 'Register' : 'Login'}</h2>
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
                <div>
                    <label htmlFor='password'>Password:</label>
                    <input
                        type='password'
                        id='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button type='submit'>{registered ? 'Register' : 'Login'}</button>
            </form>
            <button onClick={() => setRegistered(!registered)}>
                {registered ? 'Click here to login' : 'Click here to register'}
            </button>
        </div>
    );
};

export default UserLogin;
