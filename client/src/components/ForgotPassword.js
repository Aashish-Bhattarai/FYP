import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import './ForgotPassword.css'; // Import the CSS file

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:3001/forgot-password', { email });
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Password reset link sent to your email!",
            });
            // Reset the email field
            setEmail('');
            navigate('/');
        } catch (err) {
            console.error('Error sending password reset link:', err);
            // Handle error if necessary
        }
    };

    return (
        <div className='forgot-password-container'>
            <div className='forgot-password-form'>
                <h2 className='reset-password-text'>Forgot Password?</h2>
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper" style={{ display: 'flex' }}>
                        <FontAwesomeIcon icon={faEnvelope} style={{ paddingTop: '20px' }} /> &ensp;
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter your email"
                            required
                            value={email}
                            style={{ width: '350px', height: '55px', marginBottom: '30px' }}
                            onChange={(e) => setEmail(e.target.value)}
                            className='reset-password-input'
                        />
                    </div>
                    <button
                        className='reset-password-btn'
                        style={{ width: '150px', marginLeft: '110px' }}
                        type='submit'
                    >Send</button>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
