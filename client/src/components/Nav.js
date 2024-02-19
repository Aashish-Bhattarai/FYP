// Nav.js
import React from 'react';
import './Nav.css'; // Import the new CSS file for NavBar styles

const NavBar = () => {
    return (
        <nav className="navbar">
            <ul className="nav-list">
                <li className="nav-item">Home</li>
                <li className="nav-item">Services</li>
                <li className="nav-item">About</li>
                
            </ul>
        </nav>
    );
};

export default NavBar;
