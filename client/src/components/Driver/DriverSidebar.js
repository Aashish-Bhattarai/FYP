import React from 'react'
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './driverui.css';

function DriverSidebar() {
  return (
    <div className='bg-white sidebar p-2'>
        <div className='m-2'>
            <i className='bi bi-compass me-3 fs-4'></i>
            <span className='brand-name fs-4'>YatraSathi</span>
        </div>
        <hr className='text-dark' />
        <div className='list-group list-group-flush'>
            <Link to="/DriverProfile" className='list-group-item py-2'>
                <i className='bi bi-person fs-5 me-3'></i>
                <span>Driver Profile</span>
            </Link>
            <Link to="/PDRequests" className='list-group-item py-2'>
                <i className='bi bi-journal-text fs-5 me-3'></i>
                <span>Requests</span>
            </Link>
            <Link to="/DriverHistory" className='list-group-item py-2'>
                <i className='bi bi-clock-history fs-5 me-3'></i>
                <span>History</span>
            </Link>
            <Link to="/logout" className='list-group-item py-2'>
                <i className='bi bi-power fs-5 me-3'></i>
                <span>Logout</span>
            </Link>
        </div>
    </div>
  )
}

export default DriverSidebar;
