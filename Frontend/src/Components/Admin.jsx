import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../Components/ApiServer/ApiServer.jsx';
import '../Components/Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async () => {
    try {
      // Call the admin login API
      const response = await ApiService.adminLogin(employeeId, password, secretCode);

      // Check if login was successful
      if (response && response.token) {
        // Store the JWT token in localStorage
        localStorage.clear();
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('isAdmin', response.isAdmin);

        // Redirect to the feed page on successful login
        navigate('/feed');
      }
    } catch (error) {
      // Handle login errors
      if (error.response && error.response.status === 401) {
        // Handle invalid credentials
        setErrorMessage('Invalid credentials');
      } else {
        // Handle other errors
        console.error('Error during login:', error);
        setErrorMessage('An unexpected error occurred');
      }
    }
  };

  return (
    <div>
      <div className="form">
        <div className="admin">
          <div className="admin-formstyle">
            {errorMessage && <div className="error-message">{errorMessage}</div>}
            <div className="Employee ID">
              <input
                type="text"
                placeholder='Employee ID'
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
              />
            </div>
            <div className="password">
              <input
                type="password"
                placeholder='Password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="Re-password">
              <input
                type="text"
                placeholder='Secret Code'
                value={secretCode}
                onChange={(e) => setSecretCode(e.target.value)}
              />
            </div>
            <button className='adminbtn' onClick={handleLogin}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
