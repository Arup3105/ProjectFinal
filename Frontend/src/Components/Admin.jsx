import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ApiService from '../Components/ApiServer/ApiServer.jsx';
import '../Components/Admin.css';

const Admin = () => {
  const navigate = useNavigate();
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    try {
      const response = await ApiService.adminLogin(employeeId, password);

      if (response && response.token) {
        localStorage.clear();
        localStorage.setItem('jwtToken', response.token);
        localStorage.setItem('isAdmin', response.isAdmin);
        navigate('/feed');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setError('Invalid credentials');
      } else {
        console.error('Error during login:', error);
        setError('An unexpected error occurred');
      }
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
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className="admin-btn">
              <button onClick={handleLogin}>
                Login
              </button>
            </div>
            <Link to="/admin/AdminForgot" className='fpassword'>
              Forgot Password?
            </Link>
            <br />
            <p>
              <Link to='/AdminRegister' className='signin'>
                Register as <span>ADMIN</span>
              </Link>
            </p>
            {/* <p>
                  Not an Admin? {" "}
                  <Link to="/Login" className="signin">
                    Login
                  </Link>
                  </p> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
