import React from 'react'
import {NavLink} from 'react-router-dom';
import logo from "../assets/logo5-white-100-rectangle.png"

const linkbtn = "block mt-4 lg:inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"


function Navbar() {
  return (
    <nav className="flex items-center justify-between flex-wrap bg-sky-800 p-6">
      <div className='text-base lg:flex-grow'>
        <img className="fill-current mr-2 lg:inline-block" src={logo}/>
        <NavLink to='/' className={linkbtn}>Home</NavLink>
        <NavLink to='/signup' className={linkbtn}>Sign Up</NavLink>
        <NavLink to='/login' className={linkbtn}>Login</NavLink>
        <NavLink to='/display'className={linkbtn}>Display</NavLink>
      </div>
    </nav>
  )
}

export default Navbar;