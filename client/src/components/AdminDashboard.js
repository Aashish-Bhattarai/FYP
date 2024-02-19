//AdminDashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

const AdminDashboard = () => {
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Get the token from local storage
        const token = localStorage.getItem('token');

        // If token is not present, redirect to login
        if (!token) {
            navigate('/');
            return;
        }

        // Decode the token to get user information
        const decodedToken = jwtDecode(token);

        // Check if the role is 'admin'
        if (decodedToken.role !== 'admin') {
            // Redirect to the login page if the user is not an admin
            navigate('/home');
            return;
        }

        // Fetch data from the protected route
        axios.get('http://localhost:3001/protected', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setMessage(response.data.message);
        })
        .catch(error => {
            console.error(error);
            // Redirect to the login page if there is an authorization error
            navigate('/');
        });
    }, [navigate]);

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>{message}</p>
        </div>
    );
};

export default AdminDashboard;
