import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const navigate = useNavigate();
    const { search } = useLocation();

    useEffect(() => {
        const verifyEmail = async () => {
            const params = new URLSearchParams(search);
            const code = params.get('code');
            const email = params.get('email');

            try {
                const response = await fetch(`http://localhost:9000/verify?code=${code}&email=${email}`);

                if (!response.ok) {
                    throw new Error('Verification failed');
                }

                const data = await response.json();
                console.log(data.message); 
                navigate('/user-verified');
            } catch (error) {
                console.error('Error verifying email:', error);
            }
        };

        verifyEmail();
    }, [search, navigate]);

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Verifying...</h1>
            <p>Please wait while we verify your email...</p>
        </div>
    );
};

export default EmailVerification;
