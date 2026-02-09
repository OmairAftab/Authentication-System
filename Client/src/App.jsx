import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import VerifyEmail from './Pages/VerifyEmail'
import ResetPassword from './Pages/ResetPassword'

const App = () => {
  return (
    <div style={{padding: '20px', fontSize: '24px'}}>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/login' element={<Login />}/>
        <Route path='/verify-email' element={<VerifyEmail />}/>
        <Route path='/reset-password' element={<ResetPassword />}/>
      </Routes>
    </div>
  )
}

export default App