import React from 'react'
import '../Components/Admin.css'

const Admin = () => {
  return (
    <div>
      <div className="admin">
        <input type="text" placeholder='username'/>
        <input type="password" placeholder='Password'/>
        <input type="text" placeholder='Secret Code'/>
        <button>Login</button>
      </div>
    </div>
  )
}

export default Admin