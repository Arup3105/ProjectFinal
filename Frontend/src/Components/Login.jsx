import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Components/login.css';
import logimg from '/public/login.jpg'
import ApiService from '../Components/ApiServer/ApiServer.jsx';

const Login = () => {
  const [rollNumber, setRollNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Function to delete token from localStorage after 1 day
  const deleteTokenAfterOneDay = (key) => {
    setTimeout(() => {
      localStorage.removeItem(key);
    }, 24 * 60 * 60 * 1000); // 1 day in milliseconds
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Make a request to the server to authenticate the user
      const response = await ApiService.userLogin({ rollNumber, password });

      // Check if the response has a token
      if (response.token) {
        // Handle successful login
        localStorage.clear();
        localStorage.setItem('jwtToken', response.token);

        // Set token deletion after 1 day
        deleteTokenAfterOneDay('jwtToken');

        // Redirect the user to the home page or another page after login
        navigate('/feed'); // Use navigate instead of history
      }
    } catch (error) {

      console.log("this is the response", error.message)
      setError(error.message);
    }

  };

  return (
    <div>

      <main className='log-main'>
        <div className="container">
          {/* <div className="left">
            <div className="login-imagecontainer">
              <div className="overlay">
                <h2>Welcome Back</h2>
                <p>
                  Lorem ipsum dolor sit amet, Lorem, ipsum dolor sit <br /> amet
                  consectetur adipisicing elit. Quae, id!
                </p>
              </div>
            </div>
          </div> */}
          <div class="image">
            <img src={logimg} alt="" />
          </div>

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
                <a href="#" className='fpassword'>
                  Forgot Password?
                </a>{' '}
                <br />
                <button type="submit">Login</button> <br />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <p>
                  Don't have an account{' '}
                  <Link to='register' className='signin'>
                    Register
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Login;
