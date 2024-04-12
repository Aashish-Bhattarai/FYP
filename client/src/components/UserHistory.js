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
          <div className="card-body">
            {/* Implement similar structure for Pickup & Drop History */}
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
