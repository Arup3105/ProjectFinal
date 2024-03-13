import React from 'react'
import './AdminRegister.css'

const AdminRegister = () => {
  return (
    <div className='admin-reg'>
      <div className="container">
      <form action="#">
        <div className="formstyle">
          <div className="username">
            <div className="name">
              <label htmlFor="username">Name</label>
              <input type="text" placeholder='Enter Your Name Here' />
            </div>

          </div>
          <div className="contact">
            <div className="email">
              <label htmlFor="Email">Email ID</label>
              <input type="email" placeholder='Enter Your Email ID Here' />
            </div>
            <div className="phone">
              <label htmlFor="Phone">Phone No</label>
              <input type="number" placeholder='Enter Your Phone Number Here' />
            </div>
          </div>
          <div className="password">
            <label htmlFor="password">Password</label>
            <input type="password" placeholder='Enter Password' />
          </div>
          <div className="Re-password">
            <label htmlFor="password">Secret Code</label>
            <input type="password" placeholder='Secret Code' />
          </div>
          <div className="admin-regbtn">
          <button>Register</button>
          </div>
        </div>
      </form>
      </div>
    </div>
  )
}

export default AdminRegister
