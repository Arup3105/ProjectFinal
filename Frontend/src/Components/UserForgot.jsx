import React, { useState } from "react";
import ApiService from "../Components/ApiServer/ApiServer.jsx";
import "../Components/ForgetPassword.css";
import { Link } from "react-router-dom";

const UserForgot = () => {
  const [formData, setFormData] = useState({
    rollNumber: "",
    regNumber: "",
    secretCode: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      rollNumber,
      regNumber,
      secretCode,
      newPassword,
      confirmNewPassword,
    } = formData;

    if (newPassword !== confirmNewPassword) {
      setError("New password and confirm password do not match.");
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      const response = await ApiService.userForgetPassword(
        rollNumber,
        regNumber,
        secretCode,
        newPassword
      );
      setSuccessMessage(response.message);
      setError("");
      setTimeout(() => {
        window.location.href = "/Login";
      }, 5000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="form">
        <div className="admin">
          <div className="admin-formstyle">
      <h1>User Forgot Password Page</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>RollNumber:</label>
          <input
            type="text"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>
        
        <div>
          <label>Registration Number:</label>
          <input
            type="text"
            name="regNumber"
            value={formData.regNumber}
            onChange={handleChange}
          />
        </div>
        <div>
        <label>Secret Code:</label>
        <input
            type="password"
            name="secretCode"
            value={formData.secretCode}
            onChange={handleChange}
          /> 
        </div>
        <div>
          <label>New Password:</label>
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label>Confirm New Password:</label>
          <input
            type="password"
            name="confirmNewPassword"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            autoComplete="new-password"
          />
          {error && <p style={{ color: 'red' }}>{error}</p>}
          {successMessage && <div>{successMessage}</div>}
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>
        Go Back to{" "}
        <Link to="/Login" className="signin">
          Login
        </Link>
      </p>
    </div>
    </div>
    </div>
  );
};

export default UserForgot;
