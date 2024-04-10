// Footer.js
import React from 'react';

const Footer = () => {
  return (
    <div className="footer" style={footerStyle}>
      <p>© {new Date().getFullYear()} YatraSathi</p>
    </div>
  );
}

export default Footer;

const footerStyle = {
  backgroundColor: '#333',
  color: 'white',
  textAlign: 'center',
  padding: '20px',
  position: 'fixed',
  bottom: 0,
  width: '100%',
  height: '60px',
};