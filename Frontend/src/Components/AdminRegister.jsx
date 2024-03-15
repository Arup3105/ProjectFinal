import React, { useState } from 'react';
import './AdminRegister.css';
import ApiService from '../Components/ApiServer/ApiServer.jsx';

const AdminRegister = () => {
  const [username, setUsername] = useState('');
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [secretCode, setSecretCode] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const formData = {
        username,
        employeeId,
        password,
        email,
        mobileNumber,
        secretCode,
        authCode
      };

      // Assuming ApiService.register sends a request to the backend
      const response = await ApiService.adminregister(formData);

      // Handle success response
      console.log('Admin registered successfully:', response);
    } catch (error) {
      // Handle error response
      console.error('Error registering admin:', error);
      setError(error.message || 'Failed to register admin');
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
              <input type='password' placeholder='Enter Password' value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='SecretCode'>
              <label htmlFor='SecretCode'>Secret Code</label>
              <input type='password' placeholder='Secret Code will be used for login' value={secretCode} onChange={(e) => setSecretCode(e.target.value)} />
            </div>
            <div className='adminCreateAuthCode'>
              <label htmlFor='adminCreateAuthCode'>Admin Create Auth Code</label>
              <input type='text' placeholder='Enter Admin Create Auth Code' value={authCode} onChange={(e) => setAuthCode(e.target.value)} />
            </div>
            <div className='admin-regbtn'>
              <button type='submit'>Register</button>
            </div>
          </div>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>
    </div>
  );
};

export default AdminRegister;
