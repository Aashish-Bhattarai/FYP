import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Footer from './Footer';
import DateTime from './DateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import Maps from './Map';
import PickupSearchBox from './PickupSearchBox';
import DropSearchBox from './DropSearchBox';
import NavBar from './Nav';
import Swal from 'sweetalert2';

const PickupAndDropService = (props) => {
  const [pickupPosition, setPickupPosition] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const [distance, setDistance] = useState(0);
  const [cost, setCost] = useState(0);
  const [confirmDisabled, setConfirmDisabled] = useState(true);
  const [selectedDateTime, setSelectedDateTime] = useState();

  useEffect(() => {
    // Calculate cost whenever distance changes
    const calculateCost = () => {
      let baseFarePerKm = 250;
      if (distance > 3 && distance <= 10) {
        baseFarePerKm = 150;
      } else if (distance > 10) {
        baseFarePerKm = 100;
      }
      return baseFarePerKm * distance;
    };
    setCost(calculateCost());
  }, [distance]);

  useEffect(() => {
    // Update confirm button state whenever DateTime, pickupPosition, or dropPosition changes
    setConfirmDisabled(selectedDateTime === null || pickupPosition === null || dropPosition === null);
  }, [selectedDateTime, pickupPosition, dropPosition]);

  const fetchPlaceName = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
      );
      const data = await response.json();
      const placeName = data.display_name;
      return placeName;
    } catch (error) {
      console.error('Error fetching place name:', error);
      return null;
    }
  };

  const handleConfirmBooking = async () => {
    if (!selectedDateTime || !pickupPosition || !dropPosition) {
      console.error('Please select date and time, pickup and drop locations before confirming booking.');
      return;
    }
  
    try {
      
      // Fetch place names for pickup and drop positions asynchronously
      const [pickupPlaceName, dropPlaceName] = await Promise.all([
        fetchPlaceName(pickupPosition.lat, pickupPosition.lon),
        fetchPlaceName(dropPosition.lat, dropPosition.lon)
      ]);
  
      if (pickupPlaceName && dropPlaceName) {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        const userId = decodedToken.id;
  
        const userResponse = await axios.get(`http://localhost:3001/users/getUser/${userId}`);
        const { name, email, phone } = userResponse.data;
  
        const bookingData = {
          BookedDateAndTime: selectedDateTime,
          BookingTime: new Date(),
          PickupLocation: pickupPlaceName,
          DropLocation: dropPlaceName,
          Distance: distance.toFixed(2),
          Cost: cost.toFixed(0),
          userId: userId,
          userName: name,
          userEmail: email,
          userPhone: phone,
          status: 'Pending',
          IsCompleted: false
        };
  
        const response = await axios.post('http://localhost:3001/BookPickupDrop', bookingData);
        console.log('Rental Booking Requested:', response.data);
        
        // Reset state values to initial values
        Swal.fire({
          icon: 'success',
          title: 'Booking Confirmed',
          text: 'Your pickup and drop service has been booked successfully!',
          confirmButtonText: 'OK',
        }).then((result) => {
          if (result.isConfirmed) {
            // Reload the page if the user clicks "OK"
            window.location.reload();
          }
        });
        
      } else {
        console.error('Error fetching place names.');
      }
    } catch (error) {
      console.error('Error confirming booking:', error);
      // Handle error as needed
    }
  };
  

  const leftSideStyle = {
    flex: 1,
    padding: '20px',
    margin: '7% 3%',
    border: '1px solid #ccc', /* Add borders for visibility */
    width: '500px',
    height: 'auto',
    borderRadius: '15px',
    marginRight: '3%',
  };

  const rightSideStyle = {
    flex: 1,
    padding: '20px',
    margin: '7% 3%',
    border: '1px solid #ccc', /* Add borders for visibility */
    width: '500px',
    borderRadius: '15px',
    marginLeft: '3%',
  };

  return (
    <>
      <NavBar />
      <div className="pickup-drop-container">
        <div className='left-side' style={leftSideStyle}>
          <u><h1>Pickup & Drop Service:</h1></u>
          &nbsp;
          <div className='text'>
            <div className='DateTime'>
              <b><p style={{ fontSize: '21px' }}>Date and Time &nbsp;<FontAwesomeIcon icon={faCalendar} /> : </p></b>
              &emsp; <DateTime setSelectedDateTime={(value) => setSelectedDateTime(value)} />
            </div>
            <div className='Pick-up'>
              <b><p style={{ fontSize: '21px' }}>Pick-Up Location &nbsp;<FontAwesomeIcon icon={faMapLocationDot} /> :</p></b>
              <PickupSearchBox selectPosition={pickupPosition} setSelectPosition={setPickupPosition} />
            </div> <br />
            <div className='Drop'>
              <b><p style={{ fontSize: '21px' }}>Drop Location &nbsp;<FontAwesomeIcon icon={faMapLocationDot} /> :</p></b>
              <DropSearchBox selectPosition={dropPosition} setSelectPosition={setDropPosition} />
            </div>
            {distance !== 0 &&
              <div>
                <label style={{ display: 'flex', marginLeft: '20px', marginBottom: '12px', marginTop: '5px', fontSize: '18px' }}> <strong>Distance:</strong> &ensp;{distance.toFixed(2)}<b><i> &nbsp;Km</i></b>  </label>
                <label style={{ display: 'flex', marginLeft: '20px', fontSize: '18px' }}><strong>Cost:</strong> &ensp;<b><i> &nbsp;Rs.</i></b> {cost.toFixed(0)} </label>
              </div>
            }
          </div>
          <button className='confirmation' style={{ marginTop: '10px', display: confirmDisabled ? 'none' : 'block' }} onClick={handleConfirmBooking}> Confirm </button>
        </div>
        <div className='right-side' style={rightSideStyle}>
          <Maps pickupPosition={pickupPosition} dropPosition={dropPosition} setPickupPosition={setPickupPosition} setDropPosition={setDropPosition} distance={distance} setDistance={(value) => setDistance(value)} />
        </div>
      </div>
      <style>
        {`
          .pickup-drop-container {
              display: flex;
          }

          .left-side h1, 
          .right-side h1 {
              text-align: center;
          }

          .DateTime {
              display: inline-flex;
          }

          .Pick-up {
              margin-top: 30px;
          }

          .left-side p, 
          .right-side p {
              margin-left: 20px;
          }

          .confirmation {
              width: 180px;
              height: 40px;
              font-size: 18px;
              border-radius: 5px;
              margin-left: 35%;
              margin-top: 30px;
              transition: 0.3s;
              position: relative;
          }

          .confirmation:hover:not([disabled]) {
            background-color: #66ab68;
            box-shadow: 0 0 10px rgba(102, 171, 104, 0.8);
            border-color: #66ab68;
            color: #fff;
          }
        `}
      </style>
    </>
  );
}

export default PickupAndDropService;
