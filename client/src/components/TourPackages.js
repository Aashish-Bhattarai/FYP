import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import NavBar from './Nav';
import Footer from './Footer';




function TourPackages() {
    const [pkg, setPkg] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000)); // mindate is allowed to be selected is selected initially
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
        if (selectedDate) {
            setSelectedPackage(packageDetails);
            setShowPopup(true);
            fetchWeatherData(selectedDate);
        } else {
            // Handle the case where selectedDate is null
            console.error('Please select a date before booking.');
        }
    };

    useEffect(() => {
        if (selectedDate && selectedPackage) {
            const cityName = extractCityName(selectedPackage.PackageName);
            fetchWeatherData(selectedDate, cityName);
        }
    }, [selectedDate, selectedPackage]);


    const handleClosePopup = () => {
        setShowPopup(false);
    };

    const handleConfirmBooking = () => {
        // Fetch userId from token
        const token = localStorage.getItem('token');
        if (token) {
            const userId = JSON.parse(atob(token.split('.')[1])).id;
    
            // Fetch user details using userId
            axios.get(`http://localhost:3001/users/getUser/${userId}`)
                .then(userResponse => {
                    const { name, email, phone } = userResponse.data;
    
                    // Include user's name and email in the booking data
                    const bookingData = {
                        PackageName: selectedPackage.PackageName,
                        BookedDate: selectedDate,
                        BookingTime: new Date(),
                        PeopleCapacity: selectedPackage.VehicleType,
                        Cost: selectedPackage.Cost,
                        status: 'Pending', // Default status
                        userId: userId,
                        userName: name, 
                        userEmail: email,
                        userPhone: phone 
                    };
    
                    // Post booking data to the server
                    axios.post('http://localhost:3001/BookPackage', bookingData)
                        .then(response => {
                            console.log('Booking Package Requested:', response.data);
                            // Optionally, you can show a success message or perform other actions
                        })
                        .catch(error => {
                            console.error('Error confirming booking:', error);
                            // Handle error scenario
                        });
                })
                .catch(error => {
                    console.error('Error fetching user details:', error);
                    // Handle error scenario
                });
        } else {
            console.error('User token not found in local storage.');
        }
    
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

    const fetchWeatherData = (startDate, cityName) => {
        // Calculate the end date (7 days after the selected date or the minimum allowed date)
        let endDate;
        const minAllowedDate = new Date(new Date().getTime() + 1 * 24 * 60 * 60 * 1000); // Minimum allowed date (1 day after the current date)
        const maxAllowedDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // Maximum allowed date (7 days after the current date)
    
        // Check if the selected date is within 7 days from the minimum allowed date
        if (startDate >= minAllowedDate && startDate <= maxAllowedDate) {
            endDate = new Date(startDate);
            endDate.setDate(startDate.getDate() + 6); // End date is 7 days after the selected date
        } else {
            endDate = maxAllowedDate; // End date is 7 days after the minimum allowed date
        }
    
        // Initialize an object to store daily weather data
        const dailyWeather = {};
    
        // Fetch weather data for the city and date range
        const API_KEY = '2be50454c5b1f41625422c22151ffd75';
        axios.get(`https://api.openweathermap.org/data/2.5/forecast?q=${cityName}&appid=${API_KEY}&units=metric&cnt=40`)
            .then(response => {
                // Process each forecast entry
                response.data.list.forEach(forecast => {
                    const forecastDate = new Date(forecast.dt * 1000);
                    const forecastDateKey = forecastDate.toDateString(); // Use date string as key
    
                    // Check if forecast date is within the selected range
                    if (forecastDate >= startDate && forecastDate <= endDate) {
                        // Add temperature to dailyWeather object
                        if (!dailyWeather[forecastDateKey]) {
                            dailyWeather[forecastDateKey] = {
                                temperatureSum: 0,
                                weatherDescriptions: []
                            };
                        }
                        dailyWeather[forecastDateKey].temperatureSum += forecast.main.temp;
                        dailyWeather[forecastDateKey].weatherDescriptions.push(forecast.weather[0].description);
                    }
                });
    
                // Calculate average temperature and weather description for each day
                const dailyWeatherData = [];
                for (const dateKey in dailyWeather) {
                    const averageTemperature = dailyWeather[dateKey].temperatureSum / dailyWeather[dateKey].weatherDescriptions.length;
                    const weatherDescription = dailyWeather[dateKey].weatherDescriptions[0]; // Use the first description
                    dailyWeatherData.push({ date: new Date(dateKey), averageTemperature, weatherDescription });
                }
    
                // Update state with daily weather data
                setWeather(dailyWeatherData);
            })
            .catch(error => {
                console.error('Error While Fetching Weather Data:', error);
            });
    };

    return (
        <main className="main-container">
            <NavBar/>
            <style>{`
                .package-container {
                    max-height: calc(100vh - 75px);
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: flex-start;
                    margin-top: 20px; 
                }

                .Cards-View {
                    margin-top:2%;
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
                <h2 style={{ 
                    textAlign: 'center', 
                    color: '#515d69', 
                    fontSize: '3.5rem', 
                    fontWeight: 'bold',
                    marginBottom: '25px',
                    fontFamily: 'Montserrat, sans-serif',
                    textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)', 
                    borderBottom: '3px solid #293642', 
                    paddingBottom: '10px' 
                }}>
                    Explore Our Exclusive Packages
                </h2>
                {/* Render package cards */}
                {pkg.map((packageDetails, index) => (
                    <div className="card" key={index}>
                        <div className="card-inner row">
                            <div className="card-content">
                                {/* <h6>Package Name: {packageDetails.PackageName}</h6>
                                <p>Description: {packageDetails.Description}</p>
                                <p>Duration: {packageDetails.Duration}</p>
                                <p>Vehicle Name: {packageDetails.VehicleName}</p>
                                <p>Vehicle Type: {packageDetails.VehicleType}</p>
                                <p>Cost: {packageDetails.Cost}</p> */}
                                <div className="details" style={{display:'flex', position:'relative', backgroundColor: '#e8e8e8', borderRadius: '5px'}}>
                                    <div className="package-image" style={{float: 'left', width: '35%', marginLeft: '15px'}}>
                                    <img
                                        src={`http://localhost:3001/images/${packageDetails.Image}`}
                                        className="img-fluid mb-3"
                                        style={{width:'300px', height:'200px', borderRadius: '8px', marginTop: '35px' }}
                                    />
                                    </div>
                                    <div className="package-details" style={{float: 'right', width: '65%', marginLeft: '30px', marginTop: '15px'}}>
                                    <div style={{ display: "flex", alignItems: "center" }}>
                                        <h4 style={{ margin: "0", marginRight: "10px" }}>Package:</h4> &ensp;
                                        <i> <h5 style={{ margin: "0" }}>{packageDetails.PackageName}</h5> </i>
                                    </div>
                                    <br/>
                                    <p><b>Description:</b>&ensp; {packageDetails.Description}</p>
                                    <p><b>Duration:</b>&ensp; {packageDetails.Duration}</p>
                                    <p><b>Vehicle Name:</b>&ensp; {packageDetails.VehicleName}</p>
                                    <p><b>Vehicle Type:</b>&ensp; {packageDetails.VehicleType}</p>
                                    <p><b>Cost:</b>&ensp; {packageDetails.Cost} <i>.Per Person</i></p>
                                    </div>
                                </div>
                            </div>
                            <div className="card-buttons" style={{marginTop:'30px'}}>
                                <button className="btn btn-primary" style ={{padding:'10px', paddingLeft:'20px', paddingRight:'20px', marginRight:'30px', marginBottom:'8px', fontSize:'20px'}} onClick={() => handleBookNow(packageDetails)}>Book Now</button>
                            </div>
                        </div>
                    </div>
                ))}
                </div>
                </div>
            </div>
            {showPopup && (
                <div className="popup-overlay">
                    <div className="popup" style={{marginTop:'60px'}}>
                        
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
                            {/* Display recommended activities */}
                            {selectedPackage && selectedPackage.Recommended && Array.isArray(selectedPackage.Recommended) && (
                               <div className="recommended-activities" style={{ backgroundColor: '#cdcdcd', borderRadius: '8px', padding: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px', marginBottom:'20px', position: 'relative', width: 'auto' }}>
                                    <h3 style={{ backgroundColor: '#0056b3', color: '#fff', padding: '15px', borderRadius: '8px 8px 0 0', marginBottom: '10px', textAlign: 'center', fontSize: '1.3rem', width: '100%', marginTop: '0', position: 'absolute', top: '0', left: '0' }}>Recommended Activities</h3>
                                    <ol style={{ listStyleType: 'none', padding: '0', margin: '0', textAlign: 'left', marginTop: '40px' }}>
                                        {selectedPackage.Recommended[0].split(',').map((activity, index) => (
                                            <li key={index} style={{ padding: '8px 0', borderBottom: '1px solid #999', fontSize: '1rem', lineHeight: '1.6' }}>
                                                <span style={{ marginRight: '5px', fontWeight: 'bold' }}>{index + 1}.</span> {activity.trim()}
                                            </li>
                                        ))}
                                    </ol>
                                </div>                                       
                            )}
                            {/* Display weather information here */}
                            {weather && weather.length > 0 && (
                                <div className="weather-display" style={{ backgroundColor: '#f2f2f2', borderRadius: '8px', padding: '15px', boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', marginTop: '20px', marginBottom:'20px', position: 'relative', width: 'auto', overflow: 'hidden' }}>
                                    <h3 style={{ backgroundColor: '#0056b3', color: '#fff', padding: '15px', borderRadius: '8px', textAlign: 'center', fontSize: '1.5rem', width: '100%', top: '0', zIndex: '1', }}>Weather Forecast</h3>
                                    <div className="weather-info" style={{ maxHeight: '400px', overflowY: 'auto', marginTop: '20px', position: 'relative', zIndex: '0' }}>
                                        <div className="row">
                                            {weather.map((forecast, index) => (
                                                <div className="col-md-4 mb-4" key={index}>
                                                    <div className="card">
                                                        <div className="card-body">
                                                            <h5 className="card-title">{forecast.date.toLocaleDateString()}</h5>
                                                            <p className="card-text">Average Temperature: {forecast.averageTemperature.toFixed(2)} °C</p>
                                                            <p className="card-text">Weather: {forecast.weatherDescription}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div class="container">
                            <button className="btn btn-primary" onClick={handleConfirmBooking}>Confirm Booking</button>
                            
                            
                            <button style={{ 
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

export default TourPackages;
