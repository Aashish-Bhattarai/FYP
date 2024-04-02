import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';

function TourPackages() {
    const [pkg, setPkg] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(null); // Initialize selectedDate as null
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
        const cityName = extractCityName(selectedPackage.PackageName);
        fetchWeatherData(date, cityName);
    };

    const extractCityName = (packageName) => {
        //Extracting city name from the package name
        const cityName = packageName.split('To ')[1];
        return cityName;
    }

    const fetchWeatherData = (date, cityName) => {
        // Fetch weather data for the city and date
        const API_KEY = 'YOUR_API_KEY';
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&cnt=7`)
            .then(response => {
                setWeather(response.data.list);
            })  
            .catch(error => {
                console.error('Error While Fetching Weather Data:', error);
            });
    };

    return (
        <main className="main-container">
            <style>{`
                .package-container {
                    max-height: 100vh; /* Set the maximum height for the container */
                    overflow-y: auto; /* Allow vertical scrolling */
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center; /* Center the cards horizontally */
                }

                .Cards-View {
                    margin-top:15%;
                    margin-bottom:5%;
                    width: 60%; 
                }

                .card {
                    margin-top: 50px;
                    padding: 20px;
                    background-color: #f9f9f9;
                    border-radius: 10px;
                    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
                }

                .card-inner {
                    display: flex;
                    align-items: center;
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
                    background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent background */
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 999; /* Ensure popup is on top of other content */
                }

                .popup {
                    background-color: #fff;
                    margin-bottom: 100px;
                    padding: 20px;
                    border-radius: 10px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
                }

                .popup-inner {
                    max-width: 600px; /* Adjust popup width as needed */
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

                .weather-info {
                    margin-bottom: 20px;
                }

                /* Hide scrollbar when popup is open */
                body.popup-open {
                    overflow: hidden;
                }
            `}</style>
            <div>
                <div className="package-container">
                <div className="Cards-View">
                <h2 style={{textAlign:'center'}}>Available Packages:</h2>
                {/* Render package cards */}
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
                </div>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup">
                        <button className="close-btn" onClick={handleClosePopup}>X</button>
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
                            {/* Display weather information here */}
                            {weather && weather.length > 0 && (
                                <div className="weather-info">
                                    <h3>Weather Forecast</h3>
                                    {weather.map((forecast, index) => (
                                        <div key={index}>
                                            <p>Date: {new Date(forecast.dt * 1000).toLocaleDateString()}</p>
                                            <p>Temperature: {forecast.main.temp}°C</p>
                                            <p>Weather: {forecast.weather[0].description}</p>
                                        </div>
                                    ))}
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
