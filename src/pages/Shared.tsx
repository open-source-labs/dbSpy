import React from 'react';
import {Link, Outlet} from 'react-router-dom';
import Navbar from '../components/Navbar';
import useCredentialsStore from '../store/credentialsStore';

function Shared() {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION

  
  return (
    <>
    <Navbar/>
    {/* Outlet renders child elements */}
    <Outlet/>
    </>
  )
}

export default Shared;