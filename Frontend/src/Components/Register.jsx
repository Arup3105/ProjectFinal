import React from 'react';
import { Link } from 'react-router-dom';
import '../Components/register.css'

const Register = () => {
    return (
        <div>
            <nav>
                <div className="logo"><div className="spinner"></div>Logo</div>
                <Link to='/' className="navbtn">LogIn</Link>
            </nav>
            <main>
                <div className="container">
                    <div className="left">
                        <div className="imagecontainer">
                            <div className="overlay">
                                <h2>Welcome To Our Website</h2>
                                <p>Lorem ipsum dolor sit amet,Lorem, ipsum dolor sit <br /> amet consectetur adipisicing elit. Quae, id!</p>
                            </div>
                        </div>

                    </div>
                    <div className="form">
                        <form action="#">
                            <h2>Register Here</h2>
                            <div className="formstyle">
                                <div className="username">
                                    <label htmlFor="username">Username</label>
                                    <input type="text" placeholder='Enter your username here' />
                                </div>
                                <div className="password">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" placeholder='Enter Password' />
                                </div>
                                <div className="Re-password">
                                    <label htmlFor="password">Confirm Password</label>
                                    <input type="password" placeholder='Confirm Password' />
                                </div>
                                <button>Login</button> <br />
                                <p>Already have a account <Link to='/' className='signin'>Login</Link></p>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Register