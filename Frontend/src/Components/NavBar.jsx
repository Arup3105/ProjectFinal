import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import '../Components/NavBar.css'

const NavBar = () => {
 const [menuopen,setMenuopen] = useState(false);

  return (
    <div>
      <nav>
        <div className="logo">Logo</div>
        <div className="menu" onClick={()=>{
          setMenuopen(!menuopen);
        }}>
          <span></span>
          <span></span>
          <span></span>
        </div>
        <ul className={menuopen ? "open" : ""}>
            <li><Link to='/'>Home</Link></li>
            <li><NavLink to='/about'>About</NavLink></li>
            <li><NavLink to='#'>Services</NavLink></li>
            <li><NavLink to='#'>Contacts</NavLink></li>
        </ul>
      </nav>
    </div>
  )
}

export default NavBar
