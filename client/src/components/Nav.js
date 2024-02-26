// Nav.js
import React from 'react';
import './Nav.css'; // Import the new CSS file for NavBar styles

const NavBar = () => {
    return (
        <nav>
        <div className="nav-left">
          <a href="/">Home</a>
          <a href="/about">About</a>
          <a href="/history">History</a>
        </div>
        <div className="nav-right">
          <a href="/logout">Logout</a>
        </div>
      </nav>
    );
};

export default NavBar;
