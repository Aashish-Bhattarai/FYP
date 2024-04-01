// PickupAndDropService.js
import React, { useState, useEffect } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import './PickupAndDropService.css';
import DateTime from './DateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMapLocation, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import Maps from './Map';
import PickupSearchBox from './PickupSearchBox';
import DropSearchBox from './DropSearchBox';

const PickupAndDropService = (props) => {

  const [pickupPosition, setPickupPosition] = useState(null);
  const [dropPosition, setDropPosition] = useState(null);
  const {distance} = props;

  // const [cost, setCost] = useState(null);

  // useEffect(() => {
  //   // Calculate cost if distance is provided
  //   if (distance !== null) {
  //     const calculatedCost = distance * 200;
  //     setCost(calculatedCost);
  //   }
  // }, [distance]);

  // console.log("distance: ", distance)

  return (
    <>
      <Nav />
      <div className="pickup-drop-container">
        <div className='left-side'>
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
            {/* {distance !== null && (
              <div>
                <p><b>Distance to travel:</b> {distance} km</p>
                <p><b>Cost:</b> NPR {cost}</p>
              </div>
            )} */}
          </div>
          <button className='confirmation'> Confirm </button>
        </div>
        <div className='right-side'>
          <Maps pickupPosition = {pickupPosition} dropPosition = {dropPosition} setPickupPosition = {setPickupPosition} setDropPosition = {setDropPosition} />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PickupAndDropService;

