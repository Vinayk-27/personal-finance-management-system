import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUserCircle, FaBars, FaTimes } from 'react-icons/fa'; // Hamburger and Close Icons

import './CSS/navbar.css';

function Navbar() {
  const [loggedInUser, setLoggedInUser] = useState(localStorage.getItem('loggedInUser') || '');
  const [emailuser, setemailUser] = useState(localStorage.getItem('email') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false); // For toggling mobile menu
  const navigate = useNavigate();
  let dropdownMenu = document.getElementById('Drop-down');
  useEffect(() => {
    const updateAuthStatus = () => {
      setLoggedInUser(localStorage.getItem('loggedInUser') || '');
      setemailUser(localStorage.getItem('email') || '');
      setIsAuthenticated(!!localStorage.getItem('token'));
      dropdownMenu.style.display = 'none';
    };

    window.addEventListener('storage', updateAuthStatus);
    return () => {
      window.removeEventListener('storage', updateAuthStatus);
    };
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: sectionId } });
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      localStorage.removeItem('token');
      localStorage.removeItem('loggedInUser');
      window.dispatchEvent(new Event('storage'));
      alert('User Logged Out Successfully');
      navigate('/login');
    }
  };
 
  const toggleDropdown = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  const open =()=>{
    dropdownMenu.style.display = 'flex';
  }
  const close =()=>{
    dropdownMenu.style.display = 'none';
  }


  return (
    <>
    <div id="navbar">
      <div className="logo">
        
        <h4>PFMS</h4>
      </div>

      {/* Hamburger Menu */}
      <div className="hamburger" onClick={toggleDropdown} >
        {isMenuOpen ? <h4 onClick={close}><FaTimes /></h4>: <h4 onClick={open}><FaBars /></h4>}
      </div>

      {/* Links */}
      <div id="links">
        <a onClick={() => scrollToSection('home')} className="nav-link">Home</a>
        <a onClick={() => scrollToSection('services')} className="nav-link">Services</a>
        <a onClick={() => scrollToSection('about')} className="nav-link">About</a>
        <a onClick={() => scrollToSection('contact')} className="nav-link">Contact</a>

        {isAuthenticated ? (
          <div className="nav-links" id='ok'>
            <FaUserCircle className="user-icon" onClick={toggleDropdown} />
            <h2 id="loggedinusername">{loggedInUser}</h2>
            
              <div className="dropdown-menu">
                <button onClick={handleLogout} id="logoutBtn">Logout</button>
              </div>
            
          </div>
        ) : (
          <div className="nav-links" id="loginBtn">
            <Link to="/login" className="nav-link">Login</Link>
          </div>
        )}
      </div>
      
      
    </div>
    <div id="Drop-down" >
    <a onClick={() => scrollToSection('home')} className="Drop-navlinks">Home</a>
    <a onClick={() => scrollToSection('services')} className="Drop-navlinks">Services</a>
    <a onClick={() => scrollToSection('about')} className="Drop-navlinks">About</a>
    <a onClick={() => scrollToSection('contact')} className="Drop-navlinks">Contact</a>

    {isAuthenticated ? (
      <div className="Drop-navlinks" id='Drop-downUserInfo'>
        <FaUserCircle className="user-icon" onClick={toggleDropdown} />
        <h2 id="loggedinusername">{loggedInUser}</h2>
        
          <div className="dropdown-menu1">
            <button onClick={handleLogout} id="logoutBtn">Logout</button>
          </div>
        
      </div>
    ) : (
      <div className="Drop-navlinks" id="drop-downloginBtn">
        <Link to="/login" className="Drop-navlinks">Login</Link>
      </div>
    )}
  </div>
  </>
  );
}

export default Navbar;
