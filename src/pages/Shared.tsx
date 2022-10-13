import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import Navbar from '../components/Navbar'

function Shared() {
  return (
    <>
    <Navbar/>
    {/* Outlet renders child elements */}
    <Outlet/>
    </>
  )
}

export default Shared;