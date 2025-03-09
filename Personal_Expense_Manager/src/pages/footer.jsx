import React from 'react';
import './CSS/Footer.css'; // Link to your CSS file for styling
import { Link ,useNavigate } from 'react-router-dom';
// Import the images
import emailIcon from './Footer_Images/email.png';

const Footer = () => {
  const navigate = useNavigate();
  const scrollToSection = (sectionId) => {
   
    // If already on home, just scroll
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
   else {
    // If on another page, navigate to home and scroll after load
    navigate("/", { state: { scrollTo: sectionId } });
  }
  };
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>About Us</h3>
          <p>
            "CashFlow is your ultimate platform to efficiently manage your finances. Whether you're a business or an individual, CashFlow helps you track income, expenses, and optimize cash management. Stay on top of your financial health and make informed decisions with ease!"
          </p>
        </div>
        <div className="footer-section">
          <h3>Links</h3>
          <ul>
          <a onClick={() => scrollToSection('home')} className="nav-link">Home</a>
          <a onClick={() => scrollToSection('services')} className="nav-link">Services</a>
          <a onClick={() => scrollToSection('about')} className="nav-link">About</a>
          <a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a>
          </ul>
        </div>
        <div className="footer-section">
          <h3>Contact</h3>
          <div className="contact-info">
            <img src={emailIcon} alt="Email Icon" />
            <p>Email: Chetankolhe@gmail.com</p>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>&copy; 2025 CashFlow. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
