import React from 'react'
import Login from './Components/Login'
import Register from './Components/Register'
import { Route, Routes } from 'react-router-dom'
import './Components/register.css';
import Feed from './Components/Feed';
import Company from './Components/Company';
import Admin from './Components/Admin';

const App = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='register' element={<Register />} />
        <Route path='feed' element={<Feed />}>
          <Route path='company' element={<Company />} />
        </Route>
        <Route path='admin' element={<Admin />} />
      </Routes>
    </div>
  )
}

export default App
