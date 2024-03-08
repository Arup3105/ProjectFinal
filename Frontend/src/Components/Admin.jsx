import React from 'react'
import '../Components/Admin.css'

const Admin = () => {
  return (
    <div>
      <div className="form">
        <div className="admin">
          <div className="admin-formstyle">
            <div className="username">
            <input type="text" placeholder='username' />
            </div>
            <div className="password">
            <input type="password" placeholder='Password' />
            </div>
            <div className="Re-password">
            <input type="text" placeholder='Secret Code' />
            </div>
            <button className='adminbtn'>Login</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Admin