import React from 'react';
import { Link } from 'react-router-dom';
import '../Components/register.css'

const Register = () => {
    return (
        <div>
            {/* <nav>
                <div className="logo"><div className="spinner"></div>Logo</div>
                <Link to='/' className="navbtn">LogIn</Link>
            </nav> */}
            <main>
                <div className="container">
                    {/* <div className="left"> */}
                        {/* <div className="imagecontainer"> */}
                            {/* <div className="overlay"> */}
                                {/* <h2>Welcome To Our Website</h2> */}
                                {/* <p>Lorem ipsum dolor sit amet,Lorem, ipsum dolor sit <br /> amet consectetur adipisicing elit. Quae, id!</p> */}
                            {/* </div> */}
                        {/* </div> */}

                    {/* </div> */}
                    <div className="form">
                        <form action="#">
                            <h2>Register Here</h2>
                            <div className="formstyle">
                                <div className="username">
                                    <div className="name">
                                    <label htmlFor="username">Name</label>
                                    <input type="text" placeholder='Enter Your Name Here' />
                                    </div>
                                    
                                </div>
                                <div className="numbers">
                                <div className="roll">
                                        <label htmlFor="RollNumber">Roll Number</label>
                                        <input type="number" placeholder='Enter Your Roll Number'/>
                                    </div>
                                    <div className="reg">
                                        <label htmlFor="RollNumber">Reg Number</label>
                                        <input type="number" placeholder='Enter Your Reg Number'/>
                                    </div>
                                </div>

                                <div className="contact">
                                    <div className="email">
                                        <label htmlFor="Email">Email ID</label>
                                        <input type="email" placeholder='Enter Your Email ID Here'/>
                                    </div>
                                    <div className="phone">
                                        <label htmlFor="Phone">Phone No</label>
                                        <input type="number" placeholder='Enter Your Phone Number Here'/>
                                    </div>
                                </div>

                                <div className="address">
                                    <label htmlFor="Address">Address</label>
                                    <input type="text" placeholder='Enter Your Address Here'/>
                                </div>

                                <div className="tenth">
                                    <div className="marks">
                                        <label htmlFor="Marks">10th Marks</label>
                                        <input type="number" placeholder='10th Marks Here'/>
                                    </div>
                                    <div className="marksheet">
                                        <label htmlFor="Marksheet">10th Marksheet</label>
                                        <input type="file"/>
                                    </div>
                                </div>

                                
                                <div className="twelve">
                                    <div className="marks">
                                        <label htmlFor="Marks">12th Marks</label>
                                        <input type="number" placeholder='12th Marks Here'/>
                                    </div>
                                    <div className="marksheet">
                                        <label htmlFor="Marksheet">12th Marksheet</label>
                                        <input type="file"/>
                                    </div>
                                </div>

                                <div className="sem-marks">
                                    <div className="first">
                                        <label htmlFor="Marksheet">First Sem Marksheet</label>
                                        <input type="file" />
                                    </div>

                                    <div className="second">
                                        <label htmlFor="Marksheet">Second Sem Marksheet</label>
                                        <input type="file" />
                                    </div>

                                    <div className="third">
                                        <label htmlFor="Marksheet">Third Sem Marksheet</label>
                                        <input type="file" />
                                    </div>

                                    <div className="fourth">
                                        <label htmlFor="Marksheet">Fourth Sem Marksheet</label>
                                        <input type="file" />
                                    </div>

                                    <div className="fifth">
                                        <label htmlFor="Marksheet">fifth Sem Marksheet</label>
                                        <input type="file" />
                                    </div>

                                    <div className="sixth">
                                        <label htmlFor="Marksheet">Sixth Sem Marksheet</label>
                                        <input type="file" />
                                    </div>
                                </div>
                                <div className="password">
                                    <label htmlFor="password">Password</label>
                                    <input type="password" placeholder='Enter Password' />
                                </div>
                                <div className="Re-password">
                                    <label htmlFor="password">Confirm Password</label>
                                    <input type="password" placeholder='Confirm Password' />
                                </div>

                                <div className="reg-btn">
                                <button>Register</button> <br />
                                </div>
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