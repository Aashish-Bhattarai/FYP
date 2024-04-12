import React, { useState, useEffect } from 'react';
import NavBar from './Nav';
import Footer from './Footer';
import axios from 'axios';

// Import Bootstrap icons CSS
import 'bootstrap-icons/font/bootstrap-icons.css';

function UserProfile() {
  const [userData, setUserData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUserData, setEditedUserData] = useState(null);
  const [changePasswordData, setChangePasswordData] = useState({ currentPassword: '', newPassword: '' });
  const [showChangePasswordPopup, setShowChangePasswordPopup] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState('');

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
        setEditedUserData(result.data); // Initialize editedUserData with current user data
      })
      .catch((err) => console.log(err));
  }, []);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveChanges = () => {
    // Update user profile
    axios.put(`http://localhost:3001/userprofile/${userData._id}`, editedUserData)
      .then(() => {
        setIsEditing(false);
        setUserData(editedUserData);
      })
      .catch((err) => console.log(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUserData({ ...editedUserData, [name]: value });
  };

  const handleChangePassword = () => {
    // Check if current password matches
    axios.post(`http://localhost:3001/userprofile/${userData._id}/checkpassword`, { password: changePasswordData.currentPassword })
      .then((response) => {
        if (response.data.isValid) {
          // Update password
          axios.put(`http://localhost:3001/userprofile/${userData._id}/changepassword`, { newPassword: changePasswordData.newPassword })
            .then(() => {
              setShowChangePasswordPopup(false);
              setChangePasswordData({ currentPassword: '', newPassword: '' });
            })
            .catch((err) => console.log(err));
        } else {
          setCurrentPasswordError('Current password is incorrect');
        }
      })
      .catch((err) => console.log(err));
  };

  const handlePasswordInputChange = (e) => {
    const { name, value } = e.target;
    setChangePasswordData({ ...changePasswordData, [name]: value });

    if (name === 'newPassword') {
      checkPasswordStrength(value);
    };
  };

  const clearPasswordFields = () => {
    setChangePasswordData({ currentPassword: '', newPassword: '' });
    setCurrentPasswordError('');
  };

  const checkPasswordStrength = (password) => {
    // Define your password strength criteria
    const minLength = 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}[\]:;<>,.?~\\/-]/.test(password);
    // Calculate password strength
    const strength =
        (hasUppercase ? 1 : 0) +
        (hasLowercase ? 1 : 0) +
        (hasNumber ? 1 : 0) +
        (hasSpecialChar ? 1 : 0) +
        (password.length >= minLength ? 1 : 0);
  
    // Assign strength level based on the calculated score
    let strengthLevel = '';
    if (strength <= 2) {
        strengthLevel = 'Weak';
    } else if (strength <= 4) {
        strengthLevel = 'Medium';
    } else {
        strengthLevel = 'Strong';
    }
  
    // Update the password strength state
    setPasswordStrength(strengthLevel);
  };

  return (
    <>
      <NavBar />
      {userData ? (
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0', backgroundColor: 'rgba(50,50,50,0.95)', color: '#fff', textAlign: 'center', padding: '10px', borderTopRightRadius: '8px', borderTopLeftRadius: '8px', marginTop: '50px', width: '50%', margin: 'auto' }}>Your Profile</h2>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', border: '1.5px solid black', borderBottomRightRadius:'8px',borderBottomLeftRadius:'8px',  width:'50%', height: '450px', margin: '0 auto' }}>
            <div style={{ flex: '0 0 auto', marginBottom:'80px', marginLeft: '50px', marginRight: '50px', fontSize: '180px', display: 'flex', alignItems: 'center' }}>
              <i className="bi bi-person"></i>
            </div>
            <div style={{ flex: '1', marginLeft: '20px', fontSize: '20px' }}>
              {isEditing ? (
                <>
                  <p> <h4>Name:</h4> <input type="text" name="name" value={editedUserData.name} onChange={handleInputChange} style={{ width: '65%', padding: '5px' }} /></p>
                  <hr style={{borderTop: '1px solid #242424'}}/>
                  <p> <h4>Email:</h4> <input type="email" name="email" value={editedUserData.email} onChange={handleInputChange} style={{ width: '65%', padding: '5px' }} /></p>
                  <hr style={{borderTop: '1px solid #242424'}}/>
                  <p> <h4>Phone:</h4> <input type="tel" name="phone" value={editedUserData.phone} onChange={handleInputChange} style={{ width: '65%', padding: '5px' }} /></p>
                  <hr style={{borderTop: '1px solid #242424'}}/>
                  <p> <h4>Role:</h4> <i>{editedUserData.role}</i></p>
                  <hr style={{borderTop: '1px solid #242424'}}/>
                </>
              ) : (
                <>
                  <p> <h4>Name:</h4> <i>{userData.name}</i></p>
                  <hr style={{borderTop: '1px solid #242424'}}/>
                  <p> <h4>Email:</h4> <i>{userData.email}</i></p>
                  <hr style={{borderTop: '1px solid #242424'}}/>
                  <p> <h4>Phone:</h4> <i>{userData.phone}</i></p>
                  <hr style={{borderTop: '1px solid #242424'}}/>
                  <p> <h4>Role:</h4> <i>{userData.role}</i></p>
                  <hr style={{borderTop: '1px solid #242424'}}/>
                </>
              )}
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '50px' }}>
            {isEditing ? (
              <button onClick={handleSaveChanges} style={{ fontSize: '1.3rem', padding: '10px 10px', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>Save Changes</button>
            ) : (
              <>
                <button onClick={handleEditProfile} style={{ fontSize: '1.3rem', padding: '10px 10px', borderRadius: '8px', backgroundColor: '#57616b', color: '#fff', border: 'none', cursor: 'pointer' }}>Edit Profile</button>
                <button onClick={() => setShowChangePasswordPopup(true)} style={{ fontSize: '1.3rem', padding: '10px 10px', borderRadius: '8px', backgroundColor: '#57616b', color: '#fff', border: 'none', cursor: 'pointer', marginLeft: '10px' }}>Change Password</button>
              </>
            )}
          </div>
          {showChangePasswordPopup && (
            <div className="popup-container" style={{ position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.7)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: '999' }}>
              <div className="popup" style={{ backgroundColor: '#fff', padding: '40px', borderRadius: '10px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)', maxWidth: '475px', textAlign: 'center' }}>
                <h3 style={{ marginBottom: '20px', fontFamily: 'Arial, sans-serif', fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>Change Password</h3>
                <div style={{ marginBottom: '20px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                  <label htmlFor="currentPassword" style={{ flex: '1', marginBottom: '5px', fontFamily: 'Arial, sans-serif', fontSize: '1rem', color: '#333' }}>Current Password:</label>
                  <input type={showCurrentPassword ? 'text' : 'password'} name="currentPassword" id="currentPassword" placeholder="Enter your current password" value={changePasswordData.currentPassword} onChange={handlePasswordInputChange} style={{ flex: '2', width: '100%', padding: '10px', borderRadius: '5px', border: `1px solid ${currentPasswordError ? 'red' : '#ccc'}`, fontFamily: 'Arial, sans-serif', fontSize: '1rem', color: '#333' }} />
                  <button onClick={() => setShowCurrentPassword(!showCurrentPassword)} style={{ fontSize: '1rem', marginLeft: '5px', border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>{showCurrentPassword ? 'Hide' : 'Show'}</button>
                </div>
                {currentPasswordError && <p style={{ color: 'red', marginTop:'10px', marginBottom: '10px', marginLeft: '25px' }}>{currentPasswordError}</p>}
                <div style={{ marginBottom: '20px', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                  <label htmlFor="newPassword" style={{ flex: '1', marginBottom: '5px', fontFamily: 'Arial, sans-serif', fontSize: '1rem', color: '#333' }}>New Password:</label>
                  <input type={showNewPassword ? 'text' : 'password'} name="newPassword" id="newPassword" placeholder="Enter your new password" value={changePasswordData.newPassword} onChange={handlePasswordInputChange} style={{ flex: '2', width: '100%', padding: '10px', borderRadius: '5px', border: '1px solid #ccc', fontFamily: 'Arial, sans-serif', fontSize: '1rem', color: '#333' }} />
                  <button onClick={() => setShowNewPassword(!showNewPassword)} style={{ fontSize: '1rem', marginLeft: '5px', border: 'none', background: 'none', color: '#007bff', cursor: 'pointer' }}>{showNewPassword ? 'Hide' : 'Show'}</button>
                </div>
                <div style={{ marginBottom: '20px'}}> 
                  {changePasswordData.newPassword && (
                    <span> Password Strength: {passwordStrength}</span>
                  )}
                </div>
                <div style={{ textAlign: 'center' }}>
                  <button onClick={handleChangePassword} style={{ fontSize: '1.2rem', padding: '7px 20px', borderRadius: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Confirm</button>
                  <button onClick={() => { setShowChangePasswordPopup(false); clearPasswordFields(); }} className="close-btn" style={{ fontSize: '1.2rem', padding: '7px 20px', borderRadius: '8px', backgroundColor: '#57616b', color: '#fff', border: 'none', cursor: 'pointer' }}>Close</button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
      <Footer />
    </>
  );
}

export default UserProfile;
