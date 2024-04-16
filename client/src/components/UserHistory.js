import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from './Nav';
import Footer from './Footer';

function UserHistory() {
  const [userPackageData, setUserPackageData] = useState(null);
  const [userRentalData, setUserRentalData] = useState(null);
  const [userPickupDropData, setUserPickupDropData] = useState(null);
  const [expandedPackage, setExpandedPackage] = useState(null);
  const [expandedRental, setExpandedRental] = useState(null);
  const [expandedPickupDrop, setExpandedPickupDrop] = useState(null);
  const [rating, setRating] = useState(0);
  const [submitted, setSubmitted] = useState([]);
  const [driverRatings, setDriverRatings] = useState([]);


  // Initialize the submitted state for each pickup drop item to false
useEffect(() => {
  if (userPickupDropData) {
    setSubmitted(Array(userPickupDropData.length).fill(false));
  }
}, [userPickupDropData]);


  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;

    axios.get(`http://localhost:3001/UserPackageHistory/${userId}`)
      .then((result) => {
        setUserPackageData(result.data);
      })
      .catch((err) => console.log(err));

    axios.get(`http://localhost:3001/UserRentalHistory/${userId}`)
      .then((result) => {
        setUserRentalData(result.data);
      })
      .catch((err) => console.log(err));

    axios.get(`http://localhost:3001/UserPickupDropHistory/${userId}`)
      .then((result) => {
        setUserPickupDropData(result.data);
      })
      .catch((err) => console.log(err));
  }, []);

  const handlePackageClick = (index) => {
    setExpandedPackage((prevIndex) => (prevIndex === index ? null : index));
  };

  const handleRentalClick = (index) => {
    setExpandedRental((prevIndex) => (prevIndex === index ? null : index));
  };

  const handlePickupDropClick = (index) => {
    setExpandedPickupDrop((prevIndex) => (prevIndex === index ? null : index));
  };

  // Update the submitted state for the selected pickup drop item
  const handleSubmitRating = (index) => {
    const selectedPickupDrop = userPickupDropData[index];
    const data = {
      userId: selectedPickupDrop.userId,
      userName: selectedPickupDrop.userName,
      driverId: selectedPickupDrop.DriverId,
      driverName: selectedPickupDrop.DriverName,
      rating: rating,
      PickupDropId: selectedPickupDrop._id
    };
  
    axios.post('http://localhost:3001/submitDriverRating', data)
      .then((response) => {
        console.log('Rating submitted successfully');
        // Update the submitted state for the selected pickup drop item
        const updatedSubmitted = [...submitted];
        updatedSubmitted[index] = true;
        setSubmitted(updatedSubmitted);
      })
      .catch((error) => {
        console.error('Error submitting rating:', error);
      });
  };

  // Update the rating state for the selected pickup drop item
  const handleRatingChange = (event, index) => {
    const newRating = parseInt(event.target.value);
    setRating(newRating);
  };

  useEffect(() => {
    // Function to fetch data from the backend API
    const fetchDriverRatings = async () => {
      try {
        const response = await axios.get('http://localhost:3001/driver-ratings'); // Make a GET request to the backend API
        setDriverRatings(response.data); // Set the fetched data in state
      } catch (error) {
        console.error('Error fetching driver ratings:', error);
      }
    };

    fetchDriverRatings(); // Call the function to fetch data when component mounts
  }, []);

  const getAverageRatingForDriver = (driverId) => {
    const ratingsForDriver = driverRatings.filter((rating) => rating.DriverId === driverId);
    if (ratingsForDriver.length === 0) return "No rating yet";

    const totalRating = ratingsForDriver.reduce((acc, curr) => acc + curr.Rating, 0);
    return totalRating / ratingsForDriver.length;
  };

  return (
    <>
      <NavBar />
  <div className="container mt-5">
    <h2 className="mb-4 text-center">Welcome, Valued Customer!</h2>
    <p className="lead text-center mb-5">Explore your booking history with us.</p>
    <div className="row">
     {/* Packages History */}
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header" style={{ textAlign: 'center', fontSize: '18px' }}><b>Packages History</b></div>
          <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {userPackageData && userPackageData.some(packageItem => packageItem.status === "Accepted") ? (
              userPackageData
                .filter(packageItem => packageItem.status === "Accepted")
                .map((packageItem, index) => (
                  <div key={index} className="mb-3">
                    <button
                      className="btn btn-dark d-flex justify-content-center align-items-center"
                      type="button"
                      onClick={() => handlePackageClick(index)}
                      style={{
                        width: '100%',
                        padding: '18px',
                        backgroundColor: expandedPackage === index ? '#57616b' : '#343a40',
                        color: '#fff',
                        border: '1px solid #343a40',
                        transition: 'box-shadow 0.3s, border-color 0.3s, color 0.3s, background-color 0.3s',
                        borderRadius: '5px', // Add some rounded corners
                        textTransform: 'uppercase', // Convert text to uppercase
                        letterSpacing: '1px', // Add letter spacing
                        fontSize: '14px', // Adjust font size
                        fontWeight: 'bold', // Apply bold font weight
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.boxShadow = '0 0 15px rgba(0, 123, 255, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = expandedPackage === index ? '#f0ad4e' : '#343a40';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Package Booked: {packageItem.PackageName}
                    </button>

                    {expandedPackage === index && (
                      <div style={{ marginTop: '10px', fontSize: '14px' }}>
                        <p className="mb-1"><strong>Booked Date:</strong> {new Date(packageItem.BookedDate).toDateString()}</p>
                        <p className="mb-1"><strong>Booking Time:</strong> {new Date(packageItem.BookingTime).toLocaleString()}</p>
                        <p className="mb-1"><strong>People Capacity:</strong> {packageItem.PeopleCapacity}</p>
                        <p className="mb-1"><strong>Cost: <i>Rs.</i></strong> {packageItem.Cost}</p>
                        <p className="mb-1"><strong>Status:</strong> {packageItem.status}</p>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="alert alert-warning" role="alert">
                No package history available.
              </div>
            )}
          </div>
        </div>
      </div>


     {/* Rental History */}
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header" style={{ textAlign: 'center', fontSize: '18px' }}><b>Rental History</b></div>
          <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {userRentalData && userRentalData.some(rental => rental.status === "Accepted") ? (
              userRentalData
                .filter(rental => rental.status === "Accepted")
                .map((rental, index) => (
                  <div key={index} className="mb-3">
                    <button
                      className="btn btn-dark d-flex justify-content-center align-items-center"
                      type="button"
                      onClick={() => handleRentalClick(index)}
                      style={{
                        width: '100%',
                        padding: '18px',
                        backgroundColor: expandedRental === index ? '#57616b' : '#343a40',
                        color: '#fff',
                        border: '1px solid #343a40',
                        transition: 'box-shadow 0.3s, border-color 0.3s, color 0.3s, background-color 0.3s',
                        borderRadius: '5px', // Add some rounded corners
                        textTransform: 'uppercase', // Convert text to uppercase
                        letterSpacing: '1px', // Add letter spacing
                        fontSize: '14px', // Adjust font size
                        fontWeight: 'bold', // Apply bold font weight
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.boxShadow = '0 0 15px rgba(0, 123, 255, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = expandedRental === index ? '#f0ad4e' : '#343a40';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Vehicle Booked: {rental.VehicleName}
                    </button>

                    {expandedRental === index && (
                      <div style={{ marginTop: '10px', fontSize: '14px' }}>
                        <p className="mb-1"><strong>Booked Date:</strong> {new Date(rental.BookedDate).toDateString()}</p>
                        <p className="mb-1"><strong>Booking Time:</strong> {new Date(rental.BookingTime).toLocaleString()}</p>
                        <p className="mb-1"><strong>Rented Days:</strong> {rental.RentedDays}</p>
                        <p className="mb-1"><strong>Seating Type:</strong> {rental.SeatingType}</p>
                        <p className="mb-1"><strong>Vehicle Year:</strong> {rental.VehicleYear}</p>
                        <p className="mb-1"><strong>Total Cost: <i>Rs.</i></strong> {rental.CostTotal}</p>
                        <p className="mb-1"><strong>Status:</strong> {rental.status}</p>
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="alert alert-warning" role="alert">
                No rental history available.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pickup & Drop History */}
      <div className="col-md-4">
        <div className="card mb-4">
          <div className="card-header" style={{ textAlign: 'center', fontSize: '18px' }}><b>Pickup & Drop History</b></div>
          <div className="card-body" style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {userPickupDropData && userPickupDropData.some(item => item.status === "Accepted") ? (
              userPickupDropData
                .filter(item => item.status === "Accepted")
                .map((item, index) => (
                  <div key={index} className="mb-3">
                    <button
                      className="btn btn-dark d-flex justify-content-center align-items-center"
                      type="button"
                      onClick={() => handlePickupDropClick(index)}
                      style={{
                        width: '100%',
                        padding: '18px',
                        backgroundColor: expandedPickupDrop === index ? '#57616b' : '#343a40',
                        color: '#fff',
                        border: '1px solid #343a40',
                        transition: 'box-shadow 0.3s, border-color 0.3s, color 0.3s, background-color 0.3s',
                        borderRadius: '5px', // Add some rounded corners
                        textTransform: 'uppercase', // Convert text to uppercase
                        letterSpacing: '1px', // Add letter spacing
                        fontSize: '14px', // Adjust font size
                        fontWeight: 'bold', // Apply bold font weight
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.borderColor = '#007bff';
                        e.target.style.boxShadow = '0 0 15px rgba(0, 123, 255, 0.7)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.borderColor = expandedPickupDrop === index ? '#f0ad4e' : '#343a40';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      Pickup Drop History {index + 1}
                    </button>

                    {expandedPickupDrop === index && (
                      <div style={{ marginTop: '10px', fontSize: '14px' }}>
                        <p className="mb-1"><strong>Booked Date:</strong> {new Date(item.BookedDateAndTime).toDateString()}</p>
                        <p className="mb-1"><strong>Pickup Location:</strong> {item.PickupLocation}</p>
                        <p className="mb-1"><strong>Drop Location:</strong> {item.DropLocation}</p>
                        <p className="mb-1"><strong>Driver Name:</strong> {item.DriverName}</p>
                        <p className="mb-1"><strong>Contact:</strong> {item.DriverPhone}</p>
                        <p className="mb-1"><strong>Driver Rating:</strong> {getAverageRatingForDriver(item.DriverId)}</p>
                        {item.IsCompleted && !submitted[index] &&  !driverRatings.some(driverRating => driverRating.PickupDropId === item._id) && (
                          <div style={{ marginTop: '10px' }}>
                            <p className="mb-2"><strong>Please rate the driver:</strong></p>
                            <div className="d-flex flex-column align-items-center">
                              <div className="d-flex justify-content-between w-100 mb-1">
                                <span>1</span>
                                <span>2</span>
                                <span>3</span>
                                <span>4</span>
                                <span>5</span>
                              </div>
                              <input
                                type="range"
                                className="form-range w-100"
                                min="1"
                                max="5"
                                value={rating}
                                onChange={(event) => handleRatingChange(event, index)}
                              />
                            </div>
                            <button className="btn btn-primary mt-2" onClick={() => handleSubmitRating(index)}>Submit Rating</button>
                            {submitted[index] && (
                              <p className="mt-2 text-success">Your rating has been submitted. Thank you!</p>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
            ) : (
              <div className="alert alert-warning" role="alert">
                No pickup & drop history available.
              </div>
            )}
          </div>
        </div>
      </div>


   
    </div>
  </div>
  <Footer />
    </>
  );
}

export default UserHistory;
