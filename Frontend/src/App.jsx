import React from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import './Components/register.css';
import Feed from './Components/Feed';
import Admin from './Components/Admin';
import SeeCompany from './Components/SeeCompany';
import PostsByCompany from './Components/PostByCompany'
import { Route, Routes } from 'react-router-dom';
import NavBar from './Components/NavBar';
import AdminRegister from './Components/AdminRegister';
// import AdminPostCreation from './Components/AdminPostCreation';


const App = () => {
  return (
    <div>
      <NavBar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="feed" element={<Feed />} />
        <Route path="seeCompany/:startYear/:endYear" element={<SeeCompany />} />
        <Route path="/postsByCompany/:companyName/:startYear/:endYear/:targetedStreams" element={<PostsByCompany />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default App;
