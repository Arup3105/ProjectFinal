import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { CiSearch } from 'react-icons/ci';
import '../Components/NavBar.css';

const NavBar = ({ isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      <nav>
        <div className="logo">
          <div className="spinner"></div>Logo
        </div>
        <div className="menu" onClick={() => setMenuOpen(!menuOpen)}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        
        {/* Conditionally render search bar for admin */}
        {isAdmin && (
          <div className="search">
            <input type="search" placeholder="Search here" />
            <CiSearch color="white" fontSize="4.5rem" />
          </div>
        )}

        <Link to="Admin" className="navbtn">
          Admin
        </Link>
        <ul className={menuOpen ? 'open' : ''}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="#">Services</NavLink>
          </li>
          <li>
            <NavLink to="#">Contacts</NavLink>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
