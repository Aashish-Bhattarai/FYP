import React, { useState } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { useParams, useNavigate } from 'react-router-dom';
import './ResetPassword.css'; 

const ResetPassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { id, token } = useParams();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (newPassword !== confirmPassword) {
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Passwords do not match!",
                });
            } else {
                const response = await axios.post(`http://localhost:3001/reset-password/${id}/${token}`, { newPassword });
                console.log(response); // Log the response to see its structure
                if (response.status === 200) {
                    Swal.fire({
                        icon: "success",
                        title: "Success",
                        text: "Password reset successful!",
                    });
                    setNewPassword('');
                    setConfirmPassword('');
                    navigate("/");
                } else {
                    throw new Error("An error occurred while resetting the password.");
                }
            }
        } catch (err) {
            console.error('Password reset error:', err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "An error occurred while resetting the password.",
            });
        }
    };
    

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword(!showNewPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className='popup-container'>
            <div className='forgot-password-form'>
                <h1 className='reset-password-text'>Reset Password</h1>
                <form onSubmit={handleSubmit}>
                    <div className="input-wrapper" style={{ display: 'flex' }}>
                        <FontAwesomeIcon icon={faLock} style={{ paddingTop: '20px' }} /> &ensp;
                        <input
                            type={showNewPassword ? "text" : "password"}
                            id="newPassword"
                            name="newPassword"
                            placeholder="New Password"
                            required
                            value={newPassword}
                            style={{ width: '350px', height: '55px', marginBottom: '30px' }}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className='reset-password-input'
                        />
                        &ensp;
                        <FontAwesomeIcon
                            icon={showNewPassword ? faEyeSlash : faEye}
                            onClick={toggleNewPasswordVisibility}
                            style={{ cursor: 'pointer', paddingTop: '20px' }}
                        />
                    </div>
                    <div className="input-wrapper" style={{ display: 'flex' }}>
                        <FontAwesomeIcon icon={faLock} style={{ paddingTop: '20px' }} /> &ensp;
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirmPassword"
                            name="confirmPassword"
                            placeholder="Confirm Password"
                            style={{ width: '350px', height: '55px' }}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className='reset-password-input'
                        />
                        &ensp;
                        <FontAwesomeIcon
                            icon={showConfirmPassword ? faEyeSlash : faEye}
                            onClick={toggleConfirmPasswordVisibility}
                            style={{ cursor: 'pointer', paddingTop: '20px' }}
                        />
                    </div>
                    <br />
                    <button className='reset-password-btn' type='submit'>Reset Password</button>
                </form>
            </div>

        </div>
    );
};

export default ResetPassword;
