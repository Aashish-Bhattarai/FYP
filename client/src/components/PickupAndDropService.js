// PickupAndDropService.js
import React, { useState } from 'react';
import Nav from './Nav';
import Footer from './Footer';
import './PickupAndDropService.css';
import DateTime from './DateTime';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faMapLocation, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import Maps from './Map';
import PickupSearchBox from './PickupSearchBox';
import { size } from '@floating-ui/react-dom';
import DropSearchBox from './DropSearchBox';

const PickupAndDropService = () => {

  const [selectPosition, setSelectPosition] = useState(null);

  
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
             <PickupSearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition}/>
            </div>
            <div className='Drop'>
            <b><p style={{ fontSize: '21px' }}>Drop Location &nbsp;<FontAwesomeIcon icon={faMapLocationDot} /> :</p></b>
            <DropSearchBox selectPosition={selectPosition} setSelectPosition={setSelectPosition}/>
            </div>
          </div>
          <button className='confirmation'> Confirm </button>
        </div>
        <div className='right-side'>
          <Maps />
        </div>
      </div>
      <Footer />
    </>
  );
}

export default PickupAndDropService;

