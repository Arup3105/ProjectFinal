import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApiService from '../Components/ApiServer/ApiServer.jsx';
import '../Components/Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [secretCode, setSecretCode] = useState('');

  const handleLogin = async () => {
    try {
      // Call the admin login API
      const response = await ApiService.adminLogin(employeeId, password, secretCode);

      // Check if login was successful
      if (response && response.token) {
        // Store the JWT token in localStorage
        localStorage.setItem('jwtToken', response.token);
        //console.log(response.token)

        // Redirect to the feed page on successful login
        navigate('/feed');
      } else {
        // Handle unsuccessful login (show error message, etc.)
        console.error('Login failed:', response.message);
      }
    } catch (error) {
      // Handle any unexpected errors
      console.error('Error during login:', error);
    }
  };

  return (
    <div>
      <div className="form">
        <div className="admin">
          <div className="admin-formstyle">
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
