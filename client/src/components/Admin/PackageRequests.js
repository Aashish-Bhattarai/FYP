import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function PackageRequests() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Fetch booking packages data from the server
        axios.get('http://localhost:3001/ViewPackageRequest')
            .then(result => {
                setBookings(result.data);
            })
            .catch(error => {
                console.error('Error fetching booking packages:', error);
            });
    }, []);

    const formatDate = (dateString) => {
        const options = { month: 'long', day: 'numeric', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };

    const formatDateTime = (dateTimeString) => {
        const options = { month: 'long', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };
        return new Date(dateTimeString).toLocaleString('en-US', options);
    };

    const handleAcceptBooking = (id, userEmail, userName, PackageName) => {
        // Update the status of the booking to "accepted" on the server
        axios.put(`http://localhost:3001/UpdatePackageBookingStatus/${id}`, { status: 'Accepted' })
            .then(response => {
                console.log('Booking accepted:', response.data);
                const updatedBookings = bookings.map(booking => {
                    if (booking._id === id) {
                        return { ...booking, status: 'Accepted' };
                    }
                    return booking;
                });
                setBookings(updatedBookings);

                // Send email to the user
                sendEmail(userEmail, 'Booking Accepted!!', ` Dear ${userName},\n\n Your booking for the Package ${PackageName} has been accepted.\n We will shortly contact you for providing additional information.\n Please feel free to contact us regarding any urgent queries. \n \n Thankyou, Have a Good Day!!\n-YatraSathi`);
            })
            .catch(error => {
                console.error('Error accepting booking:', error);
            });
    };

    const handleRejectBooking = (id, userEmail, userName, PackageName) => {
        // Update the status of the booking to "rejected" on the server
        axios.put(`http://localhost:3001/UpdatePackageBookingStatus/${id}`, { status: 'Rejected' })
            .then(response => {
                console.log('Booking rejected:', response.data);
                const updatedBookings = bookings.map(booking => {
                    if (booking._id === id) {
                        return { ...booking, status: 'Rejected' };
                    }
                    return booking;
                });
                setBookings(updatedBookings);

                // Send email to the user
                sendEmail(userEmail, 'Booking Rejected!!', ` Dear ${userName},\n\n Your booking for the Package ${PackageName} has been rejected.\n Sorry for the inconvenience created.\n Please feel free to contact us regarding any queries. \n \n Thankyou, Have a Good Day!!\n-YatraSathi`);
            })
            .catch(error => {
                console.error('Error rejecting booking:', error);
            });
    };

    const sendEmail = (userEmail, subject, body) => {
        axios.post('http://localhost:3001/sendEmail', { recipient: userEmail, subject, body })
            .then(response => {
                console.log('Email sent:', response.data);
            })
            .catch(error => {
                console.error('Error sending email:', error);
            });
    };

    return (
        <div className="container mt-4">
            <div style={{ backgroundColor: '#4682B4', color: '#fff', textAlign: 'center', padding: '15px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', marginTop: '30px', width: '100%', margin: 'auto' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>Package Booking Requests</h2>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Package Name</th>
                        <th>User Name</th>
                        <th>Contact</th>
                        <th>Booked Date</th>
                        <th>Booking Time</th>
                        <th>People Capacity</th>
                        <th>Cost</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking._id}>
                            <td>{booking.PackageName}</td>
                            <td>{booking.userName}</td>
                            <td>{booking.userPhone}</td>
                            <td>{formatDate(booking.BookedDate)}</td>
                            <td>{formatDateTime(booking.BookingTime)}</td>
                            <td>{booking.PeopleCapacity}</td>
                            <td> Rs. {booking.Cost}</td>
                            <td>{booking.status}</td>
                            <td>
                                {booking.status === 'Pending' && (
                                    <>
                                        <button className="btn btn-primary" onClick={() => handleAcceptBooking(booking._id, booking.userEmail, booking.userName, booking.PackageName)}>Accept</button>&ensp;
                                        <button className="btn btn-danger ml-2" onClick={() => handleRejectBooking(booking._id, booking.userEmail, booking.userName, booking.PackageName)}>Reject</button>
                                    </>
                                )}
                                {booking.status === 'Accepted' && (
                                    <button className="btn btn-secondary" disabled>Accepted</button>
                                )}
                                {booking.status === 'Rejected' && (
                                    <button className="btn btn-secondary" disabled>Rejected</button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PackageRequests;
