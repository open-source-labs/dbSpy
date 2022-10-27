import React, {useState} from 'react'
import {NavLink} from 'react-router-dom';
import logo from "../assets/logo5-white-100-rectangle.png"
import useCredentialsStore from '../store/credentialsStore';

const linkbtn = "mt-4 inline-block lg:mt-0 text-blue-200 hover:text-white mr-4"


function Navbar() {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);

  const [theme, setTheme] = useState('Dark');
  //END: STATE DECLARATION

  //this is a function to toggle class between light and dark using vanilla DOM manipulation and local state.
  //FOR FUTURE DEVS: there's probably a more elegant way to do this with settings store and sharing that state globally but tailwind cascades dark mode from the top element so this works
  const toggleClass = () => {
    const page = document.getElementById("body");
    page!.classList.toggle('dark');
    theme === 'Dark' ? setTheme('Light') : setTheme('Dark');
  }

  
  return (
    <>
      <nav className="flex items-center justify-between flex-wrap bg-sky-800 p-6 fixed top-0 w-full">
        <div className='text-base navItems'>
          <img className="fill-current mr-2 inline-block" src={logo}/>
          <NavLink to='/' className={linkbtn}>Home</NavLink>
          <NavLink to='/signup' className={linkbtn}>Sign Up</NavLink>
          <NavLink to='/login' className={linkbtn}>Login</NavLink>
          <NavLink to='/display'className={linkbtn}>Display</NavLink>
          <button className='text-blue-200 hover:text-[#f8f4eb]' onClick={toggleClass}>{theme} Mode</button>
        </div>
      </nav>
      <div className='h-[64px]'>
      </div>
    </>
  )
}

export default Navbar;