import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
import logo from '../assets/newLogoWhite.png';
import login from '../assets/right-to-bracket-solid.svg';
import default_pfp from '../assets/default_pfp.svg';

// dbSpy 8.0: add icons for toggle button to control FeatureTab
import sidebarOpen from '../assets/sidebarOpen.png';
import sidebarClose from '../assets/sidebarClose.png';
import { useNavStore } from '../store/navStore';

// Images for logo animation db 7.0
// dbSpy 8.0: moved logo animation from FeatureTab to Navbar and only kept light version logo
import logo1 from '../assets/newLogoWhite_color1.png';
import logo2 from '../assets/newLogoWhite_color2.png';
import logo3 from '../assets/newLogoWhite_color3.png';
import logo4 from '../assets/newLogoWhite_color4.png';
import logo5 from '../assets/newLogoWhite_color5.png';
import logo6 from '../assets/newLogoWhite_color6.png';
import logo7 from '../assets/newLogoWhite_color7.png';
import logo8 from '../assets/newLogoWhite_color8.png';
import logo9 from '../assets/newLogoWhite_color9.png';
import logo10 from '../assets/newLogoWhite_color10.png';
import logo11 from '../assets/newLogoWhite_color11.png';
import logo12 from '../assets/newLogoWhite_color12.png';

const linkbtn = 'mt-4 inline-block lg:mt-0 text-blue-200 hover:text-white mr-4';

function Navbar() {
  // dbSpy 8.0: removed theme state and add state for the animated logo
  const [currentLogo, setCurrentLogo] = useState<string>(logo);
  const toggleClicked = useNavStore((state) => state.toggleClicked);
  const toggleNav = useNavStore((state):any => state.toggleNav);
  // toggleNav();
  //STATE DECLARATION (dbSpy3.0)
  const { user } = useCredentialsStore((state): any => state);
  //END: STATE DECLARATION

  // dbSpy 8.0: made logo animation sparkling in the navbar
  const logoImgArr: string[] = [
    logo1, logo2, logo3, logo4, logo5, logo6, 
    logo7, logo8, logo9, logo10, logo11, logo12, 
    logo12, logo12, logo12, logo
  ];
  // Effect to cycle through images automatically
  useEffect(() => {
    let currIndex = 0;
    const interval = setInterval(() => {
      setCurrentLogo(logoImgArr[currIndex]);
      currIndex = (currIndex + 1) % logoImgArr.length;
    }, 200); // Adjust speed as needed

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <>
      <nav className="fixed top-0 flex w-full flex-wrap items-center justify-between  bg-sky-800 p-2 z-50">
        <div className="navItems text-base">
          {/* dbSpy 8.0: added toggle button to control FeatureTab */}
          <img
            className="pointer-events-auto mb-1 mt-1 inline-block h-[40px] w-[50px] pr-3 filter hover:cursor-pointer hover:translate-y-[-3px] transition-transform duration-200"
            src={toggleClicked ? sidebarClose : sidebarOpen}
            alt="Toggle Sidebar"
            onClick={toggleNav}
          />

          {/* Sparkling logo */}
          <img className="mr-5 inline-block h-[45] fill-current" src={currentLogo} alt="Logo"/>

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
              <span className="mt-4 inline-block mx-auto text-blue-200 lg:mt-0">
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
