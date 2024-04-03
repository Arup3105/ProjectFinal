import React, { useState, useEffect } from "react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom"; 
import { CiSearch } from "react-icons/ci";
import "../Components/NavBar.css";
import ApiService from '../Components/ApiServer/ApiServer.jsx';

const NavBar = ({ isAdmin }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();
  const navigate = useNavigate(); 

  const isRestrictedPage =
    location.pathname === "/" ||
    location.pathname === "/register" ||
    location.pathname === "/admin" ||
    location.pathname === "/createadmin" ||
    location.pathname === "/admin/AdminForgot" ||
    location.pathname === "/user/UserForgot";

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchResultClick = async (rollNumber) => {
    try {
      if (typeof rollNumber !== 'undefined') {
        // Close the search results display
        setSearchResults([]);
        // Redirect the user to UserProfile with the selected user's data
        navigate(`/user/${rollNumber}`);
      } else {
        console.error('Invalid roll number:', rollNumber);
      }
    } catch (error) {
      console.error('Error sending roll number to backend:', error);
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (searchQuery.trim() !== "") {
          const results = await ApiService.searchData(searchQuery);
          setSearchResults(results);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching search results:", error);
      }
    };

    fetchSearchResults();
  }, [searchQuery]);

  useEffect(() => {
    // Reset searchQuery when the component unmounts
    return () => {
      setSearchQuery("");
    };
  }, []);

  useEffect(() => {

    if (isAdmin) {
      setSearchQuery("");
    }
  }, [isAdmin]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

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
              <input
                type="search"
                placeholder="Search here"
                value={searchQuery}
                onChange={handleInputChange}
              />
              {/* <CiSearch color="white" fontSize="2.6rem" /> */}
              {searchResults.length > 0 && (
                <ul className="search-results">
                  {searchResults.map((result, index) => (
                    <li key={index} onClick={() => handleSearchResultClick(result.rollNumber)}>
                      {result.username}
                      <br/>
                      {result.rollNumber}
                    </li>
                  ))}
                </ul>
              )}
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
        {!isRestrictedPage && (
          <li>
            <NavLink to="/Feed">Home</NavLink>
          </li>
          )}
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
          {!isRestrictedPage && (
          <li>
            <Link to="/" onClick={handleLogout}>LogOut</Link>
          </li>
          )}
        </ul>
      </nav>
    </div>
  );
};

export default NavBar;
