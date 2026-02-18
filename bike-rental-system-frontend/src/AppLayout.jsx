import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './components/NavBar'
const Applayout = () => {
  return (
    <div>
        <Navbar />
        <Outlet />
    </div>
  )
}

export default Applayout