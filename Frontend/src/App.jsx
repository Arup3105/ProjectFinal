import React from 'react';
import Login from './Components/Login';
import Register from './Components/Register';
import './Components/register.css';
import Feed from './Components/Feed';
import Company from './Components/Company';
import Admin from './Components/Admin';
import SeeCompany from './Components/SeeCompany';
import PostsByCompany from './Components/PostByCompany'
import { Route, Routes } from 'react-router-dom';


const App = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="feed" element={<Feed />} />
        <Route path="seeCompany/:startYear/:endYear" element={<SeeCompany />} />
        <Route path="/postsByCompany/:companyName/:startYear/:endYear" element={<PostsByCompany />} />
        <Route path="company" element={<Company />} />
        <Route path="admin" element={<Admin />} />
      </Routes>
    </div>
  );
};

export default App;
