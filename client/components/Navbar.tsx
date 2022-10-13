import React from 'react'
import {NavLink} from 'react-router-dom';

function Navbar() {
  return (
    <nav>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/signup'>Sign Up</NavLink>
        <NavLink to='/login'>Login</NavLink>
        <NavLink to='/display'>Display</NavLink>
    </nav>
  )
}

export default Navbar;