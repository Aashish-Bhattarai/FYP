// HomePage.js
import Nav from './Nav';
import './HomePage.css';
import React from 'react';

const HomePage = () => {
    return (
        <div className="home-page">
            <Nav />
            <header className="hero">
                <div className="hero-content">
                    <h1>Welcome to Your Adventure</h1>
                    <p>Discover seamless travel experiences with our rental-based application.</p>
                    <button className="cta-button">Get Started</button>
                </div>
                <img src="your-hero-image.jpg" alt="Adventure" />
            </header>
            <section className="features">
                <h2>Key Features</h2>
                <div className="feature-cards">
                    <div className="feature-card">
                        <img src="pickup-drop-icon.png" alt="Pick-up and Drop Service" />
                        <p>Pick-up and Drop Service</p>
                    </div>
                    <div className="feature-card">
                        <img src="rent-vehicles-icon.png" alt="Rent Vehicles" />
                        <p>Rent Vehicles</p>
                    </div>
                    <div className="feature-card">
                        <img src="tour-packages-icon.png" alt="Tour Packages" />
                        <p>Tour Packages</p>
                    </div>
                </div>
            </section>
            <footer>
                <div className="footer-content">
                    <div className="social-media-icons">
                        <img src="facebook-icon.png" alt="Facebook" />
                        <img src="twitter-icon.png" alt="Twitter" />
                        <img src="instagram-icon.png" alt="Instagram" />
                    </div>
                    <p>&copy; {new Date().getFullYear()} Your Company Name. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default HomePage;

