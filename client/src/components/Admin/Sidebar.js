import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './adminui.css';

function Sidebar() {
    return (
        <div className='bg-white sidebar p-2'>
            <div className='m-2'>
                <i className='bi bi-compass me-3 fs-4'></i>
                <span className='brand-name fs-4'>YatraSathi</span>
            </div>
            <hr className='text-dark' />
            <div className='list-group list-group-flush'>
                <Link to="/AdminDashboard" className='list-group-item py-2'>
                    <i className='bi bi-speedometer2 fs-5 me-3'></i>
                    <span>Dashboard</span>
                </Link>
                <Link to="/AdminPackage" className='list-group-item py-2'>
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span>Packages</span>
                </Link>
                <Link to="/AdminManagePackage" className='list-group-item py-2'>
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span>Manage Packages</span>
                </Link>
                <Link to="/AdminPackageRequest" className='list-group-item py-2'>
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span>Package Requests</span>
                </Link>
                <Link to="/AdminVehicleRental" className='list-group-item py-2'>
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span>Vehicle Rentals</span>
                </Link>
                <Link to="/AdminManageRental" className='list-group-item py-2'>
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span>Manage Rental Vehicles</span>
                </Link>
                <Link to="/AdminRentalRequest" className='list-group-item py-2'>
                    <i className='bi bi-house fs-5 me-3'></i>
                    <span>Vehicle Rental Requests</span>
                </Link>
                <Link to="/AdminAddDriver" className='list-group-item py-2'>
                    <i className='bi bi-table fs-5 me-3'></i>
                    <span>Add Driver</span>
                </Link>
                <Link to="/AdminManageDriver" className='list-group-item py-2'>
                    <i className='bi bi-table fs-5 me-3'></i>
                    <span>Manage Driver</span>
                </Link>
                <Link to="/report" className='list-group-item py-2'>
                    <i className='bi bi-clipboard-data fs-5 me-3'></i>
                    <span>Rental</span>
                </Link>
                <Link to="/customers" className='list-group-item py-2'>
                    <i className='bi bi-people fs-5 me-3'></i>
                    <span>History</span>
                </Link>
                <Link to="/customers" className='list-group-item py-2'>
                    <i className='bi bi-people fs-5 me-3'></i>
                    <span>Reports</span>
                </Link>
                <Link to="/logout" className='list-group-item py-2'>
                    <i className='bi bi-power fs-5 me-3'></i>
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
}

export default Sidebar;