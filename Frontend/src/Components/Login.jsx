import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/login.css';
import ApiService from '../Components/ApiServer/ApiServer.jsx';
import Footer from './Footer.jsx';

const Login = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const deleteTokenAfterOneDay = (key) => {
    setTimeout(() => {
      localStorage.removeItem(key);
    }, 24 * 60 * 60 * 1000); 
  };


  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await ApiService.userLogin({ rollNumber, password });
      if (response.token) {
        localStorage.clear();
        localStorage.setItem('jwtToken', response.token);

        deleteTokenAfterOneDay('jwtToken');
        
        navigate('/feed');
      }
    } catch (error) {

      console.log("this is the response",error.message)
          setError(error.message);
      }
    
  };

  return (
    <div>
      <main className='log-main'>
        <div className="container">
          <div className="form">
            <form onSubmit={handleLogin}>
              <h2>Login Here</h2>
              <div className="login-formstyle">
                <div className="rollNumber">
                  <label htmlFor="rollNumber">Roll Number</label>
                  <input
                    type="number" 
                    placeholder='Enter your Roll Number here'
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                  />
                </div>
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    placeholder='Enter Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <Link to="/user/UserForgot" className='fpassword'>
                  Forgot Password?
                </Link>{' '}
                <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <div className='log-btn'>
                <button type="submit" className='user-log'>Login</button> <br />
                </div>
                <p>
                  Don't have an account{' '}
                  <Link to='/Register' className='signin'>
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      {/* <Footer/> */}
    </div>
  );
};

export default Login;
