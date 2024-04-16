import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

function PDRequests() {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = () => {
    axios.get('http://localhost:3001/pickup-drop-requests')
      .then(response => {
        console.log('Response data:', response.data);
        setRequests(response.data);
      })
      .catch(error => {
        console.error('Error fetching pickup and drop requests:', error);
      });
  };

  const handleAcceptRequest = (requestId) => {
    const token = localStorage.getItem('token');
    if (token) {
      const userId = JSON.parse(atob(token.split('.')[1])).id;

      axios.get(`http://localhost:3001/users/getUser/${userId}`)
        .then(userResponse => {
          const { name, phone } = userResponse.data;

          axios.post(`http://localhost:3001/accepted-pickup-drop-request/${requestId}`, {
            DriverId: userId,
            DriverName: name,
            DriverPhone: phone
          })
            .then(response => {
              console.log('Request accepted:', response.data);
              fetchRequests();
            })
            .catch(error => {
              console.error('Error accepting request:', error);
            });
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
        });
    } else {
      console.error('User token not found in local storage.');
    }
  };

  return (
    <>
      <div className="fixed-top" style={{ width: '79%', marginLeft: '19%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '20px 0', textAlign: 'center' }}>
        <h2 style={{ color: '#FCFBFC', fontSize: '3.5rem', fontWeight: 'bold', fontFamily: 'Montserrat, sans-serif', marginBottom: '25px', textShadow: '1px 1px 2px rgba(0, 0, 0, 0.7)', borderBottom: '3px solid #293642', paddingBottom: '10px' }}>Pickup and Drop Requests</h2>
      </div>
      <div className="container" style={{ marginTop: '80px' }}>
        <div className="row">
          {requests.length === 0 ? (
            <div className="col-12 text-center">
              <h3>No current requests available</h3>
            </div>
          ) : (
            requests.map(request => (
              <div className="col-md-6 mb-4" key={request._id}>
                <div className="card" style={{ minHeight: '300px' }}>
                  <div className="card-body">
                    <h5 className="card-title" style={{ marginBottom: '30px' }}>User Name: <i>{request.userName}</i></h5>
                    <p className="card-text"><b>Contact: </b> {request.userPhone}</p>
                    <p className="card-text"><b>Pickup Location: </b> {request.PickupLocation}</p>
                    <p className="card-text"><b>Drop Location: </b> {request.DropLocation}</p>
                    <p className="card-text"><b>Distance: </b> {request.Distance} Km</p>
                    <p className="card-text"><b>Cost: </b> Rs. {request.Cost}</p>
                    <button className="btn btn-success" onClick={() => handleAcceptRequest(request._id)} style={{ display: 'block', margin: 'auto', paddingTop: '10px', paddingBottom: '10px' }}>Accept Request</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}

export default PDRequests;
