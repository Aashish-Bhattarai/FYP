// PickupAndDropService.js
import React, { useState, useEffect } from 'react';
import Footer from './Footer';
import DateTime from './DateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import Maps from './Map';
import PickupSearchBox from './PickupSearchBox';
import DropSearchBox from './DropSearchBox';
import NavBar from './Nav';

const PickupAndDropService = (props) => {

  const [pickupPosition, setPickupPosition] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const { distance } = props;

  const dd = distance;

  console.log("Distance in PD: ", dd)

  const leftSideStyle = {
    flex: 1,
    padding: '20px',
    margin: '7% 3%',
    border: '1px solid #ccc', /* Add borders for visibility */
    width: '500px',
    borderRadius: '15px',
    marginRight: '3%',
  };

  const rightSideStyle = {
    flex: 1,
    padding: '20px',
    margin: '7% 3%',
    border: '1px solid #ccc', /* Add borders for visibility */
    height: '600px',
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
              &emsp; <DateTime /> <br />
            </div>
            <div className='Pick-up'>
              <b><p style={{ fontSize: '21px' }}>Pick-Up Location &nbsp;<FontAwesomeIcon icon={faMapLocationDot} /> :</p></b>
              <PickupSearchBox selectPosition={pickupPosition} setSelectPosition={setPickupPosition}/>
            </div>
            <div className='Drop'>
              <b><p style={{ fontSize: '21px' }}>Drop Location &nbsp;<FontAwesomeIcon icon={faMapLocationDot} /> :</p></b>
              <DropSearchBox selectPosition={dropPosition} setSelectPosition={setDropPosition}/>
            </div>
            <p> Distance: {dd} Km</p>
          </div>
          <button className='confirmation'> Confirm </button>
        </div>
        <div className='right-side' style={rightSideStyle}>
          <Maps pickupPosition={pickupPosition} dropPosition={dropPosition} setPickupPosition={setPickupPosition} setDropPosition={setDropPosition} />
        </div>
      </div>
      <Footer />
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
          
          .confirmation:hover {
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
