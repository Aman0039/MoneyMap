import React from 'react'
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate
} from "react-router-dom"
import Login from './pages/Auth/Login'
import SignUp from './pages/Auth/SignUp'
import Home from './pages/dashboard/Home'
import Income from './pages/dashboard/income'
import Expense from './pages/dashboard/Expense'
import UserProvider from './context/useContext'

const App = () => {
  return (
    <UserProvider>
      <div className='select-none'>
        <Router>
          <Routes>
            <Route path="/" element={<Root />} />
            <Route path="/login" element={<Login />} />
            <Route path="/Signup" element={<SignUp />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/income" element={<Income />} />
            <Route path="/expense" element={<Expense />} />
          </Routes>
        </Router>
      </div>
    </UserProvider>
  )
}

export default App

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token')

  return isAuthenticated ? (<Navigate to="/dashboard" />)
    : (<Navigate to="/login" />);
}