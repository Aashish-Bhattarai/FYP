// HomePage.js
import Nav from './Nav';
import './HomePage.css';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Footer from './Footer';

const HomePage = () => {
  const navigate = useNavigate();
    return (
        <div>
            <Nav />
            <div className="welcome-section">
            <h1>Welcome to YatraSathi</h1>
            <p>Your premier choice for pick-up and drop services, daily car rentals, and unforgettable tour packages.</p>
            </div>
            <br/>
            <div className="button-container">
            <button className="main-btn" onClick={() => navigate("/pick&drop")}>Pick-up and Drop Service</button>
            <button className="main-btn" onClick={() => navigate("/RentVehicles")}>Daily Rental Service</button>
            <button className="main-btn" onClick={() => navigate("/TourPackages")}>Tour Packages</button>
            </div>
            <Footer/>
        </div>
          );
        };

export default HomePage;

