import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
import logo from '../assets/newLogoWhite.png';
import login from '../assets/right-to-bracket-solid.svg';
import default_pfp from '../assets/default_pfp.svg';

const linkbtn = 'mt-4 inline-block lg:mt-0 text-blue-200 hover:text-white mr-4';

function Navbar() {
  //STATE DECLARATION (dbSpy3.0)
  const [theme, setTheme] = useState('Dark');
  const { user } = useCredentialsStore((state): any => state);
  //END: STATE DECLARATION

  return (
    <>
      <nav className="fixed top-0 flex w-full flex-wrap items-center justify-between  bg-sky-800 p-6">
        <div className="navItems text-base">
          <img className="mr-5 inline-block h-[45] fill-current" src={logo} />
          <NavLink to="/" className={linkbtn}>
            Home
          </NavLink>
          <NavLink to="/display" data-testid="navbar-display" className={linkbtn}>
            Display
          </NavLink>
        </div>
        <div>
          {user ? (
            <>
              <span className="mt-4 inline-block text-blue-200 lg:mt-0">
                {user.full_name}
              </span>
              <img
                className="ml-2 mr-2 inline-block h-[25] rounded-full invert"
                src={default_pfp}
              />
            </>
          ) : (
            <div>
              <NavLink
                to="/login"
                className="text-white text-base font-bold leading-normal"
              >
                Login
              </NavLink>
              <img className="mr-3 ml-3 inline-block h-[20] invert" src={login} />
            </div>
          )}
        </div>
      </nav>
      <div className="h-[64px]"></div>
    </>
  );
}

export default Navbar;
