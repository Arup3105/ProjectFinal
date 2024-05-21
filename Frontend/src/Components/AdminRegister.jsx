import React, { useState } from 'react';
import './AdminRegister.css';
import ApiService from '../Components/ApiServer/ApiServer.jsx';
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const AdminRegister = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');

  const validatePhoneNumber = (phoneNumber) => {
    return /^\d{10}$/.test(phoneNumber);
  };

  const validateUsername = (username) => {
    return /^[a-zA-Z\s]+$/.test(username);
  };

  const validatePassword = (password) => {
    return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[ -~]{8,}$/.test(password);
  };


  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      if (!validatePhoneNumber(mobileNumber)) {
        setError('Phone number must be 10 digits.');
        return;
      }

      if (!validateUsername(username)) {
        setError('Username can only contain alphabetic characters and spaces.');
        return;
      }

      if (!validatePassword(password)) {
        setError('Password must be alphanumeric and contain at least 1 number, 1 capital letter, and be at least 8 characters long.');
        return;
      }

      const formData = {
        username,
        employeeId,
        password,
        email,
        mobileNumber,
        secretCode,
        authCode
      };
      const response = await ApiService.adminregister(formData);

      if (response) {
        localStorage.clear();
        navigate("/admin");
        setError("");
      } else {
        setError("Somthing Went Wrong");
      }
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <div className='admin-reg'>
      <div className='container'>
        <form onSubmit={handleRegister}>
          <div className='formstyle'>
            <div className='username'>
              <div className='name'>
                <label htmlFor='username'>Name</label>
                <input type='text' placeholder='Enter Your Username' value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div className='employeeId'>
                <label htmlFor='employeeId'>Employee ID</label>
                <input type='text' placeholder='Enter Employee ID' value={employeeId} onChange={(e) => setEmployeeId(e.target.value)} />
              </div>
            </div>
            <div className='contact'>
              <div className='email'>
                <label htmlFor='Email'>Email ID</label>
                <input type='email' placeholder='Enter Your Email ID Here' value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className='phone'>
                <label htmlFor='Phone'>Phone No</label>
                <input type='number' placeholder='Enter Your Phone Number Here' value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} />
              </div>
            </div>
            <div className='password'>
              <label htmlFor='password'>Password</label>
              <input type='password' placeholder='At least 8 characters, with 1 uppercase, 1 lowercase, and 1 number' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='SecretCode'>
              <label htmlFor='SecretCode'>Secret Code</label>
              <input type='password' placeholder='Secret Code will be used for login' value={secretCode} onChange={(e) => setSecretCode(e.target.value)} />
            </div>
            <div className='adminCreateAuthCode'>
              <label htmlFor='adminCreateAuthCode'>Admin Create Auth Code</label>
              <input type='text' placeholder='Enter Admin Create Auth Code' value={authCode} onChange={(e) => setAuthCode(e.target.value)} />
            </div>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <div className='admin-regbtn'>
              <button type='submit'>Register</button>
            </div>
            <p>
              <Link to="/admin" className="signin">
              Already have an account{" "} <span>Login</span>
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminRegister;
