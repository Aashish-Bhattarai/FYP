// Notification.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Notification.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchUserHistory = async () => {
      try {
        // Fetch user's history data from the server
        const token = localStorage.getItem('token');
        if (!token) {
          console.error('Token not found');
          return;
        }

        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;

        // Fetch user's package, rental, and pickup & drop history
        const packageResponse = await axios.get(`http://localhost:3001/UserPackageHistory/${userId}`);
        const rentalResponse = await axios.get(`http://localhost:3001/UserRentalHistory/${userId}`);
        const pickupDropResponse = await axios.get(`http://localhost:3001/UserPickupDropHistory/${userId}`);

        // Combine all history data
        const userHistory = [
          ...packageResponse.data,
          ...rentalResponse.data,
          ...pickupDropResponse.data
        ];

        // Filter accepted and pending bookings
        const acceptedBookings = userHistory.filter(item => item.status === 'Accepted');
        const pendingBookings = userHistory.filter(item => item.status === 'Pending');

        // Combine accepted and pending notifications
        const combinedNotifications = [
          ...acceptedBookings.map(item => ({
            type: item.PackageName ? 'Package' : item.VehicleName ? 'Rental' : 'Pickup & Drop',
            date: item.BookedDateAndTime ? new Date(item.BookedDateAndTime).getTime() : new Date(item.BookedDate).getTime(),
            status: item.status
          })),
          ...pendingBookings.map(item => ({
            type: item.PackageName ? 'Package' : item.VehicleName ? 'Rental' : 'Pickup & Drop',
            date: item.BookedDateAndTime ? new Date(item.BookedDateAndTime).getTime() : new Date(item.BookedDate).getTime(),
            status: item.status
          }))
        ];

        // Sort combined notifications by date
        combinedNotifications.sort((a, b) => a.date - b.date);

        // Set notifications state
        setNotifications(combinedNotifications);
      } catch (error) {
        console.error('Error fetching user history:', error);
      }
    };

    fetchUserHistory();
  }, []);

  return (
    <div className="notification-panel" style={{ width: '400px' }}>
      <h2>Notifications</h2>
      <ul>
        {notifications.map((notification, index) => (
          <li key={index} className={`notification-item ${notification.status.toLowerCase()}`}>
            <p style={{ textAlign: 'center', marginBottom: '10px' }}>{notification.type} Booking</p>
            <p>Date: {new Date(notification.date).toLocaleDateString()}</p>
            <p>Status: {notification.status}</p>
          </li>
        ))}
        {notifications.length === 0 && (
          <li className="no-notification">No notifications to display</li>
        )}
      </ul>
    </div>
  );
};

export default Notification;
