import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../Components/landingpage.css';
import Footer from './Footer';
import Carousel from './Carousel';

function LandingPage() {
  const [menuopen, setMenuopen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <div className='landingpage'>
      <div>
        <nav>
        <div className="logo">
          <img src="/apc.png" alt="" />
          </div>
          <div className="menu" onClick={() => setMenuopen(!menuopen)}>
            <span></span>
            <span></span>
            <span></span>
          </div>
          <ul className={menuopen ? "open" : ""}>
            <li><Link to='/'>Home</Link></li>
            <li
              className="dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <span>Login</span>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to='/Login'>User Login</Link></li>
                  <li><Link to='/admin'>Admin Login</Link></li>
                </ul>
              )}
            </li>
            <li
              className="dropdown"
              onMouseEnter={() => setDropdownOpen(true)}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <span>Register</span>
              {dropdownOpen && (
                <ul className="dropdown-menu">
                  <li><Link to='/Register'>User Register</Link></li>
                  <li><Link to='/AdminRegister'>Admin Register</Link></li>
                </ul>
              )}
            </li>
            <li><Link to='#'>Contact</Link></li>
          </ul>
          <button className='navbtn'>FAQ</button>
        </nav>
      </div>

      <div className="landing-container">
        <div className="left">
          <img src="/apc.png" alt="APC" />
        </div>
        <div className="right">
          <h1>Get <span>Placed</span> With Us</h1>
          <h1>Get <span>Trained</span> By The Industry Experts</h1>
          <p>The Placement Cell is integral to securing job opportunities for both undergraduate and postgraduate students. By maintaining strong connections with reputable firms and industrial establishments, the Placement Cell operates year-round to facilitate interactions between companies and graduates. The success rate of students securing positions through campus interviews continues to grow steadily.</p>
          <div className="landing-btn">
            <Link to='/Login'><button className="get-started">Get Started With Us</button></Link>
            <button className="get-started">Our Success Stories</button>
          </div>
        </div>
      </div>

      <div className="landing-card">
        <div className="left">
          <h1><span>Placement</span> Portal</h1>
          <p>The Placement Cell plays a crucial role in locating job opportunities for undergraduates and postgraduates passing out from the college by keeping in touch with reputed firms and industrial establishments.
            The placement cell operates round the year to facilitate contacts between companies and graduates. The number of students placed through the campus interviews is continuously rising.</p>
          <div className="landing-btn">
            <Link to='/Login'><button className="get-started">Get Started With Us</button></Link>
          </div>
        </div>
        <div className="right">
          <img src="/feature-7.jpg" alt="" />
        </div>
      </div>
      <Carousel />
      <Footer />
    </div>
  );
}

export default LandingPage;
