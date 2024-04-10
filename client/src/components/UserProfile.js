import React, { useState, useEffect } from 'react';
import NavBar from './Nav';
import Footer from './Footer';
import axios from 'axios';

// Import Bootstrap icons CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

function UserProfile() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
  
    if (!token) {
      console.error('Token not found');
      return;
    }
  
    const decodedToken = JSON.parse(atob(token.split('.')[1]));
    const userId = decodedToken.id;
  
    axios.get(`http://localhost:3001/userprofile/${userId}`)
      .then((result) => {
        setUserData(result.data);
      })
      .catch((err) => console.log(err));
  }, []);
  

  return (
    <>
      <NavBar />
      {userData ? (
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', backgroundColor: 'rgba(50,50,50,0.95)', color: '#fff', textAlign: 'center', padding: '10px', borderTopRightRadius: '8px', borderTopLeftRadius: '8px', marginTop: '50px', width: '50%', margin: 'auto' }}>Your Profile</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1.5px solid black', borderBottomRightRadius:'8px',borderBottomLeftRadius:'8px',  width:'50%', height: '430px', margin: '0 auto' }}>
            <div style={{ flex: '0 0 auto', marginBottom:'80px', marginLeft: '50px', marginRight: '50px', fontSize: '180px', display: 'flex', alignItems: 'center' }}>
              <i className="bi bi-person"></i>
            </div>
            <div style={{ flex: '1', marginLeft: '20px', fontSize: '22px' }}>
              <p> <h4>Name:</h4> <i>{userData.name}</i></p>
              <hr style={{borderTop: '1px solid #242424'}}/>
              <p> <h4>Email:</h4> <i>{userData.email}</i></p>
              <hr style={{borderTop: '1px solid #242424'}}/>
              <p> <h4>Phone:</h4> <i>{userData.phone}</i></p>
              <hr style={{borderTop: '1px solid #242424'}}/>
              <p> <h4>Role:</h4> <i>{userData.role}</i></p>
              <hr style={{borderTop: '1px solid #242424'}}/>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Footer />
    </>
  );
}

export default UserProfile;
