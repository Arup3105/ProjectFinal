import React, { useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import "../Components/NavBar.css";

const NavBar = ({ isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isRestrictedPage =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/admin" ||
    location.pathname === "/createadmin";

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

        {isAdmin && !isRestrictedPage && (
          <div className="con-btn">
            <div className="search">
              <input type="search" placeholder="Search here" />
              <CiSearch color="white" fontSize="2.6rem" />
            </div>
            <div className="createPost">
              <Link to="AdminPostCreation" className="navbtn">
                Create
              </Link>
            </div>
          </div>
        )}

        {location.pathname === "/" && (
          <Link to="/admin" className="navbtn">
            Admin
          </Link>
        )}

        <ul className={menuOpen ? "open" : ""}>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <NavLink to="/about">About</NavLink>
          </li>
          <li>
            <NavLink to="#">Contacts</NavLink>
          </li>
          {!isRestrictedPage && (
            <li>
              <Link to="/profile" className="navbtn">
                Profile
              </Link>
            </li>
          )}

        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
