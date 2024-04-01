import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './TourPackages.css'; // Import CSS file for styling

function TourPackages() {
    const [pkg, setPkg] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [weather, setWeather] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3001/ViewPackage")
            .then((result) => {
                setPkg(result.data);
            })
            .catch((err) => console.log(err));
    }, [refresh]);

    const handleBookNow = (packageDetails) => {
        setSelectedPackage(packageDetails);
        setShowPopup(true);
    };

    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleConfirmBooking = () => {
        setShowPopup(false);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        // Here you can fetch weather data based on the selected date
        // Example: fetchWeatherData(date);
    };

    // Placeholder function to fetch weather data
    const fetchWeatherData = (date) => {
        // Your code to fetch weather data goes here
    };

    return (
        <main className="main-container">
            <div className="main-cards">
                {/* Render room cards */}
                {pkg.map((packageDetails, index) => (
                    <div className="card" key={index}>
                        <div className="card-inner row">
                            <div className="card-content">
                                <h6>Package Name: {packageDetails.PackageName}</h6>
                                <p>Description: {packageDetails.Description}</p>
                                <p>Duration: {packageDetails.Duration}</p>
                                <p>Vehicle Name: {packageDetails.VehicleName}</p>
                                <p>Vehicle Type: {packageDetails.VehicleType}</p>
                                <p>Cost: {packageDetails.Cost}</p>
                            </div>
                            <div className="card-buttons">
                                <button className="btn btn-primary" onClick={() => handleBookNow(packageDetails)}>Book Now</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                    <button className="close-btn" onClick={handleClosePopup}>X</button>
                        <div className="popup-inner">
                            <h2>Select Date and Time for Booking</h2>
                            <div className="date-time-picker">
                                <DatePicker
                                    selected={selectedDate}
                                    onChange={handleDateChange}
                                    dateFormat="MMMM d, yyyy"
                                    className="form-control"
                                />
                                {/* You can add time picker component here */}
                            </div>
                            {/* Display weather information here */}
                            {weather && (
                                <div className="weather-info">
                                    <h3>Weather Forecast</h3>
                                    <p>Date: {selectedDate.toLocaleDateString()}</p>
                                    <p>Temperature: {weather.temperature}°C</p>
                                    <p>Weather: {weather.condition}</p>
                                </div>
                            )}
                            <button className="btn btn-primary" onClick={handleConfirmBooking}>Confirm Booking</button>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default TourPackages;
