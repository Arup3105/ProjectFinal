import React from "react";
import "./login.css";
import { Link } from "react-router-dom";

const Login = () => {
  const handleSubmit = async (event) => {
    event.preventDefault();

    const username = event.target.username.value;
    const password = event.target.password.value;

    try {
      const response = await fetch("http://your-backend-url/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log(data); // Handle the response accordingly (e.g., store token, redirect, etc.)
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  return (
    <div>
      <nav>
        <div className="logo">
          <div className="spinner"></div>Logo
        </div>
        <Link to="register" className="navbtn">
          SignUp
        </Link>
      </nav>
      <main>
        <div className="container">
          <div className="left">
            <div className="imagecontainer">
              <div className="overlay">
                <h2>Welcome Back</h2>
                <p>
                  Lorem ipsum dolor sit amet,Lorem, ipsum dolor sit <br /> amet
                  consectetur adipisicing elit. Quae, id!
                </p>
              </div>
            </div>
          </div>
          <div className="form">
            <form action="#">
              <h2>Login Here</h2>
              <div className="formstyle">
                <div className="username">
                  <label htmlFor="username">Username</label>
                  <input type="text" placeholder="Enter your username here" />
                </div>
                <div className="password">
                  <label htmlFor="password">Password</label>
                  <input type="password" placeholder="Enter Password" />
                </div>
                <a href="#" className="fpassword">
                  Forgot Password?
                </a>{" "}
                <br />
                <button>Login</button> <br />
                <p>
                  Don't have a account{" "}
                  <Link to="register" className="signin">
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
