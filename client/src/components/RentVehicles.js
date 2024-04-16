import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './Nav';
import Footer from './Footer';

function RentVehicles() {
    const [rental, setRental] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000));
    const [selectedDays, setSelectedDays] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredRental, setFilteredRental] = useState([]);
    const [bookedVehicles, setBookedVehicles] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3001/ViewRentalVehicle")
            .then((result) => {
                setRental(result.data);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    useEffect(() => {
        axios.get(`http://localhost:3001/ViewBookedVehicles`)
            .then(result => {
                setBookedVehicles(result.data);
            })
            .catch(error => {
                console.error('Error fetching booked vehicles:', error);
            });
    }, []);

    useEffect(() => {
        const currentDate = new Date();
        const filtered = rental.filter(vehicle => {
            const isBooked = bookedVehicles.some(bookedVehicle => 
                bookedVehicle.VehicleName === vehicle.VehicleName && 
                (currentDate < new Date(bookedVehicle.BookingEndDate) || currentDate >= new Date(bookedVehicle.BookingStartDate)) &&
                bookedVehicle.status !== 'Rejected'
            );
            return !isBooked;
        });
        setFilteredRental(filtered);
    }, [rental, bookedVehicles]); 

    useEffect(() => {
        const filteredList = rental.filter(vehicle =>
            vehicle.VehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.SeatingType.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRental(filteredList);
    }, [searchQuery, rental]);

    const handleBookNow = (vehicle) => {
        const isBooked = bookedVehicles.some(bookedVehicle =>
            bookedVehicle.VehicleName === vehicle.VehicleName &&
            (new Date() < new Date(bookedVehicle.BookingEndDate) || new Date() >= new Date(bookedVehicle.BookingStartDate)) &&
            bookedVehicle.status !== 'Rejected'
        );
        if (!isBooked) {
            setSelectedVehicle(vehicle);
            setShowPopup(true);
        } else {
            alert("This vehicle is already booked.");
        }
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setSelectedVehicle(null); 
        setSelectedDays(1);
    };

    const totalCost = (vehicle, selectedDays) => {
        if (vehicle) {
            return selectedDays * vehicle.Cost;
        }
        return 0;
    }

    const handleConfirmBooking = () => {
        if (selectedVehicle && selectedDate && selectedDays) {
            const token = localStorage.getItem('token');
            const decodedToken = JSON.parse(atob(token.split('.')[1]));
            const userId = decodedToken.id;
    
            // Fetch user details using userId
            axios.get(`http://localhost:3001/users/getUser/${userId}`)
                .then(userResponse => {
                    const { name, email, phone } = userResponse.data;
    
                    const bookingData = {
                        VehicleName: selectedVehicle.VehicleName,
                        BookedDate: selectedDate,
                        BookingTime: new Date(),
                        RentedDays: selectedDays,
                        SeatingType: selectedVehicle.SeatingType,
                        VehicleYear: selectedVehicle.VehicleYear,
                        CostTotal: totalCost(selectedVehicle, selectedDays),
                        status: 'Pending',
                        userId: userId,
                        userName: name,
                        userEmail: email,
                        userPhone: phone
                    };
    
                    axios.post('http://localhost:3001/BookRental', bookingData)
                        .then(response => {
                            console.log('Rental Booking Requested:', response.data);
                            const updatedFilteredRental = filteredRental.filter(item => item !== selectedVehicle);
                            setFilteredRental(updatedFilteredRental);
                        })
                        .catch(error => {
                            console.error('Error confirming booking:', error);
                        });
                })
                .catch(error => {
                    console.error('Error fetching user details:', error);
                });
        } else {
            console.error('Please select a vehicle, date, and rental duration before confirming booking.');
        }
    
        setShowPopup(false);
        setSelectedVehicle(null);
        setSelectedDays(1);
    };    
    

    return (
        <main className="main-container">
            <NavBar/>
            <style>{`
                .package-container {
                    max-height: calc(100vh - 160px);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    margin-top: 20px; 
                }

                .card {
                    margin-top: 50px;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                    width: 60%; 
                }

                .card-content {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .details {
                    width: 65%;
                }

                .rental-image {
                    width: 35%;
                }

                .rental-image img {
                    width: 100%;
                    height: auto;
                    border-radius: 8px;
                }

                .card-buttons {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                    margin-top: 20px;
                }

                .btn {
                    padding: 10px 20px;
                    font-size: 16px;
                    border: none;
                    border-radius: 5px;
                    background-color: #007bff;
                    color: #fff;
                    cursor: pointer;
                }

                .btn:hover {
                    background-color: #0056b3;
                }

                .popup-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5); 
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999; 
                }

                .popup {
                    background-color: #fff;
                    margin-bottom: 100px;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                }

                .popup-inner {
                    max-width: 600px; 
                    text-align: center;
                }

                .date-time-picker {
                    margin-bottom: 20px;
                }
            `}</style>
            <div className="package-container">
                <h2 style={{ 
                        textAlign: 'center', 
                        color: '#515d69', 
                        fontSize: '3.5rem', 
                        fontWeight: 'bold',
                        marginBottom: '25px',
                        fontFamily: 'Montserrat, sans-serif',
                        textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)', 
                        borderBottom: '3px solid #293642', 
                        paddingBottom: '10px' }}>Discover Your Ride: Explore Now</h2> <br/>
                <input
                    type="text"
                    placeholder="Search by Vehicle Name or No. of Seats"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '10px',
                        fontSize: '16px',
                        borderRadius: '5px',
                        border: '1px solid #ccc',
                        width: '20%',
                        marginBottom: '20px'
                    }}
                />
                {filteredRental.map((rentalDetails, index) => (
                    <div className="card" key={index}>
                        <div className="card-content">
                            <div className="details" style={{marginLeft: '25px'}}>
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <h4 style={{ margin: "0", marginRight: "10px" }}>Vehicle Name:</h4> &ensp;
                                <i> <h5 style={{ margin: "0" }}>{rentalDetails.VehicleName}</h5> </i>
                            </div>
                            <br/>
                            <p><b>Description:</b>&ensp; {rentalDetails.Description}</p>
                            <p><b>No. of Seats:</b>&ensp; {rentalDetails.SeatingType}</p>
                            <p><b>Vehicle Make Year:</b>&ensp; {rentalDetails.VehicleYear}</p>
                            <p><b>Cost:</b>&ensp; {rentalDetails.Cost} <i>per day</i></p>
                            </div>
                            <div className="rental-image" style={{float: 'right', width: '35%',marginRight: '10px', marginTop: '15px', marginBottom: '30px'}}>
                            <img
                                src={`http://localhost:3001/images/${rentalDetails.Image}`}
                                className="img-fluid"
                                alt={rentalDetails.VehicleName}
                                style={{width:'300px', height:'220px', borderRadius: '8px'}}
                            />
                            </div>
                        </div>
                        <div className="card-buttons" style={{marginTop:'10px'}}>
                            <button
                                className="btn btn-primary"
                                style ={{padding:'10px', paddingLeft:'20px', paddingRight:'20px', marginRight:'30px', marginBottom:'8px', fontSize:'20px'}}
                                onClick={() => handleBookNow(rentalDetails)}
                                disabled={bookedVehicles.some(bookedVehicle => 
                                    bookedVehicle.VehicleName === rentalDetails.VehicleName &&
                                    (new Date() < new Date(bookedVehicle.BookingEndDate) || new Date() >= new Date(bookedVehicle.BookingStartDate))&&
                                    bookedVehicle.status !== 'Rejected'
                                )}
                            >
                                Book Now
                            </button> 
                        </div>
                        <div>
                            {bookedVehicles.some(bookedVehicle => 
                                bookedVehicle.VehicleName === rentalDetails.VehicleName &&
                                (new Date() < new Date(bookedVehicle.BookingEndDate) || new Date() >= new Date(bookedVehicle.BookingStartDate))&&
                                bookedVehicle.status !== 'Rejected'
                            ) ? (
                                <p style={{ color: 'red' }}>This vehicle is already booked and will be available on {new Date(bookedVehicles.find(bookedVehicle => 
                                    bookedVehicle.VehicleName === rentalDetails.VehicleName &&
                                    (new Date() < new Date(bookedVehicle.BookingEndDate) || new Date() >= new Date(bookedVehicle.BookingStartDate))&&
                                    bookedVehicle.status !== 'Rejected'
                                ).BookingEndDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}.</p>
                            ) : null}
                        </div>
                    </div>
                ))}
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-inner">
                            <h2>Confirmation:</h2>
                            <div className="date-time-picker">
                                <p style={{ color: 'red', marginTop: '5px' }}>Note: You can only book 1 day earlier for now.</p>
                                <FontAwesomeIcon icon={faCalendar} /> : &ensp;
                                <DatePicker
                                    selected={selectedDate}
                                    placeholderText='select date here..'
                                    onChange={handleDateChange}
                                    minDate={new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)}
                                    maxDate={new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)}
                                    dateFormat="MMMM d, yyyy"
                                    className="form-control"
                                />
                            </div>
                            <div style={{marginBottom: '20px'}}>
                                <label htmlFor="days"><b>Select Rental Duration:</b></label> &emsp;
                                <input
                                    type="number"
                                    id="days"
                                    value={selectedDays}
                                    onChange={(e) => setSelectedDays(parseInt(e.target.value))}
                                    min={1}
                                    max={30}
                                /> &nbsp; <label> <b><i>in Days</i></b></label>
                            </div>
                            <div style={{marginBottom: '30px'}}> 
                                <label> <b>Your Total Cost:</b> </label> &emsp; 
                                Rs. {totalCost(selectedVehicle, selectedDays)} 
                                {selectedDays > 30 && (
                                    <p style={{ color: 'red', marginTop: '5px' }}>Note: Please select within 30 days.</p>
                                )}
                            </div>
                            <div className="container">
                                <button className="btn btn-primary" onClick={handleConfirmBooking} disabled={isNaN(selectedDays) || selectedDays > 30 || selectedDays < 1}>Confirm Booking </button>
                                <button
                                    style={{ 
                                        backgroundColor: '#6c757d',
                                        borderColor: '#6c757d',
                                        color: '#fff',
                                        padding: '0.375rem 0.75rem',
                                        fontSize: '1rem',
                                        lineHeight: '1.5',
                                        borderRadius: '0.25rem',
                                        cursor: 'pointer',
                                        textDecoration: 'none',
                                        display: 'inline-block',
                                        marginLeft: '30px'
                                    }}
                                    onClick={handleClosePopup}
                                    type="button"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
           <Footer/> 
        </main>
    );
}

export default RentVehicles;
