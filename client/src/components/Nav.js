// NavBar.js
import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import Notification from './Notification'; // Import the Notification component

const NavBar = () => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);

    const toggleNotification = () => {
        setIsNotificationOpen(!isNotificationOpen);
        setNotificationCount(0); // Reset notification count when opening notification panel
    };

    useEffect(() => {
        // Simulate fetching notification count from the server
        // Replace this with actual API call to get the notification count
        const fetchNotificationCount = async () => {
            try {
                // Fetch notification count from the server
                // For now, we're using a static value, but you should replace this with an API call
                const response = await fetch('http://localhost:3001/notificationCount');
                const data = await response.json();
                setNotificationCount(data.count); // Update notification count
            } catch (error) {
                console.error('Error fetching notification count:', error);
            }
        };

        fetchNotificationCount(); // Fetch notification count when the component mounts
    }, []);

    return (
        <nav>
            <div className="nav-left">
                <a href="/home">Home</a>
                <a href="/about">About</a>
                <a href="/UserProfile">Profile</a>
                <a href="/UserHistory">History</a>
            </div>
            <div className="nav-right">
                <div onClick={toggleNotification}>
                    <FontAwesomeIcon icon={faBell} style={{ marginRight: '50px', height: '20px', cursor: 'pointer', color: 'white', paddingTop: '6px' }} />
                    {notificationCount > 0 && <span className="notification-count">{notificationCount}</span>} {/* Display notification count */}
                </div>
                {isNotificationOpen && (
                    <Notification /> // Render the Notification component when isNotificationOpen is true
                )}
                <div className='logout'>
                    <a href="/logout">Logout</a>
                </div>
            </div>
            <style>
                {`
                nav {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    background-color: #333;
                    padding: 10px 40px;
                }
                
                a {
                    text-decoration: none;
                    color: white;
                    padding: 10px 15px;
                    border-radius: 5px;
                }
                
                a:hover {
                    cursor: pointer;
                }
                
                .nav-left {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 18px;
                    margin-right: 30px;
                }
                
                .nav-left a:hover {
                    background-color: #ee823a;
                }
                
                .nav-right {
                    display: flex;
                    align-items: center;
                    margin-left: auto;
                    font-size: 18px;
                }

                .notification-panel {
                    position: absolute;
                    top: 80px;
                    right: 40px;
                    background-color: white;
                    border: 1px solid #ccc;
                    border-radius: 5px;
                    padding: 20px;
                }

                .notification-count {
                    position: absolute;
                    top: 4px;
                    right: 12px;
                    background-color: red;
                    color: white;
                    font-size: 12px;
                    width: 16px;
                    height: 16px;
                    border-radius: 50%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                }
                
                .logout a:hover {
                    background-color: #57a0d3;
                }
                `}
            </style>
        </nav>
    );
};

export default NavBar;
