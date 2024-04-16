import React, { useState, useEffect } from 'react';
import axios from 'axios';

function History() {
  const [driverRequests, setDriverRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      console.error('Token not found');
      return;
    }

    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const driverId = decodedToken.id;

    axios.get(`http://localhost:3001/driver-requests/${driverId}`)
      .then(response => {
        setDriverRequests(response.data);
        setIsLoading(false);
      })
      .catch(error => {
        console.error('Error fetching driver requests:', error);
        setIsLoading(false);
      });
  }, []);

  const markRequestAsComplete = (requestId) => {
    // Update request status to completed
    axios.put(`http://localhost:3001/driver-requests/${requestId}`, { IsCompleted: true })
      .then(response => {
        console.log('Request marked as complete:', response.data);
        // Refresh requests after marking as complete
        setDriverRequests(driverRequests.map(request => {
          if (request._id === requestId) {
            return { ...request, IsCompleted: true };
          }
          return request;
        }));
      })
      .catch(error => {
        console.error('Error marking request as complete:', error);
      });
  };

  const openInMap = (pickupLocation, dropLocation) => {
    // Extract data before the first two commas
    const pickupAddress = pickupLocation.split(',').slice(0, 2).join(',');
    const dropAddress = dropLocation.split(',').slice(0, 2).join(',');
  
    // Construct the Google Maps URL with pickup and drop locations
    const mapUrl = `https://www.google.com/maps/dir/${pickupAddress}/${dropAddress}`;
    // Open the URL in a new tab
    window.open(mapUrl, '_blank');
  };

  return (
    <div style={{ marginLeft: '50px' }}>
      <p style={{ textAlign: 'center', color: 'white', fontSize: '40px', fontFamily: 'Monospace' }}>Welcome Driver, Explore Your History Here!!</p>
      <br />
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex' }}>
          <div style={{ backgroundColor: 'whitesmoke', padding: '10px', paddingRight: '25px', maxWidth: '600px', maxHeight: '680px', borderRadius: '8px', overflowY: 'auto' }}>
            <p style={{ textAlign: 'center', fontSize: '35px', fontFamily: 'garamond' }}> Accepted Requests</p>
            <ul>
              {driverRequests.filter(request => !request.IsCompleted).map(request => {
                const formattedDateTime = new Date(request.BookedDateAndTime).toLocaleString('en-US', {
                  weekday: 'long', 
                  month: 'long',  
                  day: 'numeric',  
                  hour: 'numeric', 
                  minute: 'numeric', 
                  hour12: true,   
                });
                
                return (
                  <li key={request._id}>
                    <div style={{ backgroundColor: '#8E9CB0', marginBottom: '25px', padding: '10px', borderRadius: '5px' }}>
                      <p><strong>Pickup Location:</strong> {request.PickupLocation}</p>
                      <p><strong>Drop Location:</strong> {request.DropLocation}</p>
                      <p><strong>Date Time:</strong> {formattedDateTime}</p>
                      <p><strong>Cost:</strong> Rs. {request.Cost}</p>
                      <p><strong>User Name:</strong> {request.userName}</p>
                      <p><strong>User Contact:</strong> {request.userPhone}</p>
                      <button
                        onClick={() => markRequestAsComplete(request._id)}
                        style={{
                          backgroundColor: 'whitesmoke',
                          color: 'black',
                          padding: '7px 15px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginTop: '10px',
                          marginRight: '10px',
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#ee823a';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'whitesmoke';
                          e.target.style.color = 'black';
                        }}
                      >
                        Mark as Complete
                      </button>
                      <button
                        onClick={() => openInMap(request.PickupLocation, request.DropLocation)}
                        style={{
                          backgroundColor: 'whitesmoke',
                          color: 'black',
                          padding: '7px 15px',
                          border: 'none',
                          borderRadius: '5px',
                          cursor: 'pointer',
                          marginTop: '10px',
                          marginLeft: '20px',
                          transition: 'background-color 0.3s ease, color 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#7fd0eb';
                          e.target.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = 'whitesmoke';
                          e.target.style.color = 'black';
                        }}
                      >
                        Open in Map
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div style={{ backgroundColor: 'whitesmoke', marginLeft: '50px', padding: '10px', paddingRight: '25px', maxWidth: '600px', maxHeight: '680px', borderRadius: '8px', overflowY: 'auto' }}>
            <p style={{ textAlign: 'center', fontSize: '35px', fontFamily: 'garamond' }}>Done</p>
            <ul>
              {driverRequests.filter(request => request.IsCompleted).map(request => (
                <li key={request._id}>
                  <div style={{ backgroundColor: '#8E9CB0', marginBottom: '25px', padding: '10px', borderRadius: '5px' }}>
                    <p><strong>Pickup Location:</strong> {request.PickupLocation}</p>
                    <p><strong>Drop Location:</strong> {request.DropLocation}</p>
                    <p><strong>Cost:</strong> Rs. {request.Cost}</p>
                    <p><strong>User Name:</strong> {request.userName}</p>
                    <p><strong>User Contact:</strong> {request.userPhone}</p>
                    <p>Completed</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default History;
