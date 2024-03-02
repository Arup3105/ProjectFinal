import React from "react";
import Login from "./Components/Login.jsx";
import Register from "./Components/Register";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./Components/register.css";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="register" element={<Register />}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
