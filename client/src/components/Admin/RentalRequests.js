import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function RentalRequests() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        // Fetch rental booking data from the server
        axios.get('http://localhost:3001/ViewRentalRequest')
            .then(result => {
                setBookings(result.data);
            })
            .catch(error => {
                console.error('Error fetching rental requests:', error);
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

    const handleAcceptBooking = (id) => {
        // Update the status of the booking to "accepted" on the server
        axios.put("http://localhost:3001/UpdateRentalBookingStatus/" + id, { status: 'Accepted' })
            .then(response => {
                console.log('Booking accepted:', response.data);
                const updatedBookings = bookings.map(booking => {
                    if (booking._id === id) {
                        return { ...booking, status: 'Accepted' };
                    }
                    return booking;
                });
                setBookings(updatedBookings);
            })
            .catch(error => {
                console.error('Error accepting booking:', error);
            });
    };

    const handleRejectBooking = (id) => {
        // Update the status of the booking to "rejected" on the server
        axios.put("http://localhost:3001/UpdateRentalBookingStatus/" + id, { status: 'Rejected' })
            .then(response => {
                console.log('Booking rejected:', response.data);
                const updatedBookings = bookings.map(booking => {
                    if (booking._id === id) {
                        return { ...booking, status: 'Rejected' };
                    }
                    return booking;
                });
                setBookings(updatedBookings);
            })
            .catch(error => {
                console.error('Error rejecting booking:', error);
            });
    };

    return (
        <div className="container mt-4">
            <div style={{ backgroundColor: '#4682B4', color: '#fff', textAlign: 'center', padding: '15px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', marginTop: '30px', width: '100%', margin: 'auto' }}>
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0' }}>Rental Booking Requests</h2>
            </div>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>Vehicle Name</th>
                        <th>Booked Date</th>
                        <th>Booking Time</th>
                        <th>Rented Days</th>
                        <th>Seating Type</th>
                        <th>Vehicle Year</th>
                        <th>Total Cost</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map(booking => (
                        <tr key={booking._id}>
                            <td>{booking.VehicleName}</td>
                            <td>{formatDate(booking.BookedDate)}</td>
                            <td>{formatDateTime(booking.BookingTime)}</td>
                            <td> {booking.RentedDays}</td>
                            <td>{booking.SeatingType}</td>
                            <td>{booking.VehicleYear}</td>
                            <td> Rs. {booking.CostTotal}</td>
                            <td>{booking.status}</td>
                            <td>
                                {booking.status === 'Pending' && (
                                    <>
                                        <button className="btn btn-primary" onClick={() => handleAcceptBooking(booking._id)}>Accept</button> &ensp;
                                        <button className="btn btn-danger ml-2" onClick={() => handleRejectBooking(booking._id)}>Reject</button>
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

export default RentalRequests;
