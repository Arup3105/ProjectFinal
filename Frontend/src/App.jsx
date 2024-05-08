import React, { useState, useEffect } from "react";
import Login from "./Components/Login";
import Register from "./Components/Register";
import "./Components/register.css";
import Feed from "./Components/Feed";
import Admin from "./Components/Admin";
import SeeCompany from "./Components/SeeCompany";
import PostsByCompany from "./Components/PostByCompany";
import { Route, Routes, useLocation } from "react-router-dom";
import NavBar from "./Components/NavBar";
import AdminRegister from "./Components/AdminRegister";
import AdminPostCreation from "./Components/AdminPostCreation";
import Profile from "./Components/Profile";
import UserProfile from './Components/UserProfile';
import AdminForgot from "./Components/AdminForgot";
import UserForgot from "./Components/UserForgot";
import LandingPage from "./Components/landingPage";
import PlacedStudent from "./Components/PlacedStudent";

const App = () => {
  const location = useLocation();
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = () => {
    const isAdminStored = localStorage.getItem("isAdmin") === "true";
    setIsAdmin(isAdminStored);
  };

  useEffect(() => {
    checkAdminStatus();
  }, [location]);

  return (
    <div className="app">
      <NavBar isAdmin={isAdmin} />
      <Routes>
        <Route path="/" element={<LandingPage />}/>
        <Route path="/Login" element={<Login />} />
        <Route path="admin" element={<Admin />} />
        <Route path="Register" element={<Register />} />
        <Route path="feed" element={<Feed />} />
        <Route path="seeCompany/:startYear/:endYear" element={<SeeCompany />} />
        <Route
          path="/postsByCompany/:companyName/:startYear/:endYear/:targetedStreams"
          element={<PostsByCompany />}
        />
        <Route path="AdminRegister" element={<AdminRegister />} />
        <Route path="AdminPostCreation" element={<AdminPostCreation />} />
        <Route path="/Profile" element={<Profile />} />
        <Route path="/admin/AdminForgot" element={<AdminForgot />} />
        <Route path="/user/UserForgot" element={<UserForgot />} />
        <Route path="/user/:rollNumber" element={<UserProfile />} />
        <Route path="/PlacedStudent" element={<PlacedStudent />} />
      </Routes>
    
    </div>
  );
};

export default App;
