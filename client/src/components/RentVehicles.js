import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';

function RentVehicles({vehicle}) {
    const [rental, setRental] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)); // mindate is allowed to be selected is selected initially
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
            .catch((err) => console.log(err));
    }, []);

    // Fetch booked vehicles for the selected date from the server
    useEffect(() => {
        axios.get(`http://localhost:3001/ViewBookedVehicles/${selectedDate}`)
            .then(result => {
                setBookedVehicles(result.data);
            })
            .catch(error => {
                console.error('Error fetching booked vehicles:', error);
            });
    }, [selectedDate]);

    // Filter rental vehicles based on their availability
    useEffect(() => {
        const filtered = rental.filter(vehicle =>
            !bookedVehicles.some(bookedVehicle => bookedVehicle.VehicleName === vehicle.VehicleName)
        );
        setFilteredRental(filtered);
    }, [rental, bookedVehicles]);


    useEffect(() => {
        // Filter rental vehicles whenever searchQuery changes
        const filteredList = rental.filter(vehicle =>
            vehicle.VehicleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            vehicle.SeatingType.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredRental(filteredList);
    }, [searchQuery, rental]);

    const handleBookNow = (vehicle) => {
        setSelectedVehicle(vehicle);
        setShowPopup(true);
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
            const TotalCost = selectedDays * vehicle.Cost;
            return TotalCost;
        }
        return 0;
    }

    const handleConfirmBooking = () => {

        if (selectedVehicle && selectedDate && selectedDays){
            const bookingData = {
                VehicleName: selectedVehicle.VehicleName,
                BookedDate: selectedDate,
                BookingTime: new Date(),
                RentedDays: selectedDays,
                SeatingType: selectedVehicle.SeatingType,
                VehicleYear: selectedVehicle.VehicleYear,
                CostTotal: totalCost(selectedVehicle, selectedDays),
                status: 'Pending' // Default status
            };
    
            axios.post('http://localhost:3001/BookRental', bookingData)
                .then(response => {
                    console.log('Rental Booking Requested:', response.data);
                    // Optionally, you can show a success message or perform other actions
                })
                .catch(error => {
                    console.error('Error confirming booking:', error);
                    // Handle error scenario
                });
        } else {
            console.error('Please select a package and date before confirming booking.');
        }

        // Removing the booked vehicle from the rental list
        const updatedRental = rental.filter(item => item !== selectedVehicle);
        setRental(updatedRental);

        setShowPopup(false);
        setSelectedVehicle(null); 
        setSelectedDays(1);
    };

    return (
        <main className="main-container">
            <style>{`
                .package-container {
                    max-height: calc(100vh - 100px);
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
                    flex: 1;
                }
    
                .card-buttons {
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                }
    
                .btn {
                    padding: 8px 16px;
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

                .close-btn {
                    position: absolute;
                    top: 10px;
                    right: 10px;
                    background: none;
                    border: none;
                    cursor: pointer;
                    font-size: 24px; 
                    color: #333; 
                    transition: color 0.3s, text-shadow 0.3s; 
                }

                .close-btn:hover {
                    color: red; 
                    text-shadow: 0 0 10px rgba(255, 255, 255, 0.8); 
                }

                .date-time-picker {
                    margin-bottom: 20px;
                }

                /* Hide scrollbar when popup is open */
                body.popup-open {
                    overflow: hidden;
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
                {/* Add search input field */}
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
                        width: '30%',
                        marginBottom: '20px'
                    }}
                />
                {filteredRental.map((rentalDetails, index) => (
                    <div className="card" key={index}>
                        <div className="card-content">
                            <div className="details" style={{display:'flex', position:'relative', backgroundColor: '#e8e8e8', borderRadius: '5px'}}>
                                <div className="rental-details" style={{float: 'left', width: '65%', marginLeft: '20px', marginTop: '15px'}}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <h4 style={{ margin: "0", marginRight: "10px" }}>Vehicle Name:</h4> &ensp;
                                        <i> <h5 style={{ margin: "0" }}>{rentalDetails.VehicleName}</h5> </i>
                                    </div>
                                    <br/>
                                    <p><b>Description:</b>&ensp; {rentalDetails.Description}</p>
                                    <p><b>No. of Seats:</b>&ensp; {rentalDetails.SeatingType}</p>
                                    <p><b>Vehicle Make Year:</b>&ensp; {rentalDetails.VehicleYear}</p>
                                    <p><b>Cost:</b>&ensp; {rentalDetails.Cost}</p>
                                </div>
                                <div className="rental-image" style={{float: 'right', width: '35%', marginTop: '15px', marginBottom: '40px'}}>
                                    <img
                                        src={`http://localhost:3001/images/${rentalDetails.Image}`}
                                        className="img-fluid"
                                        style={{width:'300px', height:'220px', borderRadius: '8px'}}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="card-buttons" style={{marginTop:'30px'}}>
                            <button className="btn btn-primary" style={{padding:'10px', paddingLeft:'20px', paddingRight:'20px', marginRight:'30px', marginBottom:'8px', fontSize:'20px'}} onClick={() => handleBookNow(rentalDetails)}>Book Now</button>
                        </div>
                    </div>
                ))}
                {selectedVehicle && (
                    <div className="card">
                        <div className="card-content">
                            {/* Your card content for selected vehicle here */}
                            <div className="details" style={{display:'flex', position:'relative', backgroundColor: '#e8e8e8', borderRadius: '5px'}}>
                                <div className="rental-details" style={{float: 'left', width: '65%', marginLeft: '20px', marginTop: '15px'}}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <h4 style={{ margin: "0", marginRight: "10px" }}>Vehicle Name:</h4> &ensp;
                                        <i> <h5 style={{ margin: "0" }}>{selectedVehicle.VehicleName}</h5> </i>
                                    </div>
                                    <br/>
                                    <p><b>Description:</b>&ensp; {selectedVehicle.Description}</p>
                                    <p><b>No. of Seats:</b>&ensp; {selectedVehicle.SeatingType}</p>
                                    <p><b>Vehicle Make Year:</b>&ensp; {selectedVehicle.VehicleYear}</p>
                                    <p><b>Cost:</b>&ensp; {selectedVehicle.Cost}</p>
                                </div>
                                <div className="rental-image" style={{float: 'right', width: '35%', marginTop: '15px', marginBottom: '40px'}}>
                                    <img
                                        src={`http://localhost:3001/images/${selectedVehicle.Image}`}
                                        className="img-fluid"
                                        style={{width:'300px', height:'220px', borderRadius: '8px'}}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {/* Popup code */}
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <div className="popup-inner">
                            <h2>Confirmation:</h2>
                            <div className="date-time-picker">
                                <FontAwesomeIcon icon={faCalendar} /> : &ensp;
                                <DatePicker
                                    selected={selectedDate}
                                    placeholderText='select date here..'
                                    onChange={handleDateChange}
                                    minDate={new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)} // Minimum date is 1 days after current date
                                    maxDate={new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)} // Maximum date is 7 days from the current date
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
                                <button className="btn btn-primary" onClick={handleConfirmBooking} disabled={selectedDays > 30 || selectedDays < 1}>Confirm Booking</button>
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
        </main>
    );
}

export default RentVehicles;
