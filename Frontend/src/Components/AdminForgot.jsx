import React, { useState } from 'react';
import ApiService from '../Components/ApiServer/ApiServer.jsx';
import '../Components/ForgetPassword.css';
import { Link } from "react-router-dom";


const AdminForgot = () => {
  const [formData, setFormData] = useState({
    employeeId: '',
    email: '',
    mobileNumber: '',
    secretCode: '',
    newPassword: '',
    confirmNewPassword: '',
  });

  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { employeeId, email, mobileNumber, newPassword, confirmNewPassword } = formData;

    if (newPassword !== confirmNewPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      setError("");
      setSuccessMessage("");
      const response = await ApiService.adminForgetPassword(employeeId, email, mobileNumber, formData.secretCode, newPassword);
      setSuccessMessage(response.message);
      setError("");
      setTimeout(() => {
        window.location.href = '/admin'; // Redirect to the admin page
      }, 5000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="containerForgetPassword">
      <h1>Admin Forgot Password Page</h1>
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Employee ID:</label>
          <input
            type="text"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleChange}
            autoComplete="username"
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Mobile Number:</label>
          <input
            type="text"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Secret Code:</label>
          <input
            type="text"
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
          {error && <div>{error}</div>}
          {successMessage && <div>{successMessage}</div>}
        </div>
        <button type="submit">Submit</button>
      </form>
      <p>
                  Already have an account{" "}
                  <Link to="/admin" className="signin">
                    Login
                  </Link>
                  </p>
    </div>
  );
};

export default AdminForgot;
