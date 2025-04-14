import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import useSchemaStore from '../store/schemaStore';
import useCredentialsStore from '../store/credentialsStore';
import useSettingsStore from '../store/settingsStore';
import logo from '../assets/newLogoWhite.png';
import login from '../assets/right-to-bracket-solid.svg';
import default_pfp from '../assets/default_pfp.svg';

// dbSpy 8.0: add icons for toggle button to control FeatureTab
import sidebarOpen from '../assets/sidebarOpen.svg';
import sidebarClose from '../assets/sidebarClose.svg';
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

import { SignOutIcon } from '../FeatureTabIcon';

const linkbtn = 'inline-block text-white hover:text-white mr-4';

function Navbar() {
  // dbSpy 8.0: removed theme state and add state for the animated logo
  const [currentLogo, setCurrentLogo] = useState<string>(logo);
  const toggleClicked = useNavStore((state) => state.toggleClicked);
  const toggleNav = useNavStore((state): any => state.toggleNav);
  // dbSpy 8.0: move toggle button to control dark mode in Navbar
  const { setDarkMode, darkMode } = useSettingsStore((state) => state);
  const { schemaStore, setSchemaStore } = useSchemaStore((state: any) => state);
  //STATE DECLARATION (dbSpy3.0)
  const { user, setUser } = useCredentialsStore((state): any => state);
  //END: STATE DECLARATION

  // dbSpy 8.0: made logo animation sparkling in the navbar
  const logoImgArr: string[] = [
    logo1,
    logo2,
    logo3,
    logo4,
    logo5,
    logo6,
    logo7,
    logo8,
    logo9,
    logo10,
    logo11,
    logo12,
    logo12,
    logo12,
    logo12,
    logo,
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

  //Toggle function for DarkMode
  const toggleClass = (): void => {
    const page = document.getElementById('body');
    page!.classList.toggle('dark');
    setDarkMode();
  };

  // Clears session + reset store
  const signoutSession = async () => {
    await fetch(`/api/logout`);
    window.open('/', '_self');
    setSchemaStore({});
    setUser(null);
  };

  return (
    <>
      <nav className="fixed left-1 right-1 top-2 z-50 flex w-[calc(100%-2rem)] items-center overflow-x-auto justify-between rounded-2xl bg-opacity-80 bg-gradient-to-b from-blue-400 to-transparent p-3 backdrop-blur-md">
        <div className="navItems flex flex-1 items-center text-[clamp(12px,1.2vw,16px)] min-w-0 items-center gap-2">
          {/* dbSpy 8.0: added toggle button to control FeatureTab */}
          <img
            className="w-[25px] shrink-0 filter transition-transform duration-200 hover:translate-y-[-2px] hover:cursor-pointer"
            src={toggleClicked ? sidebarClose : sidebarOpen}
            alt="Toggle Sidebar"
            onClick={toggleNav}
          />

          {/* Sparkling logo */}
          <img className="h-[3.5vw] min-h-[30px] max-h-[45px] w-auto shrink-0" src={currentLogo} alt="Logo" />

          <div className="flex min-w-0 items-center overflow-hidden whitespace-nowrap">
            <NavLink to="/" className={`${linkbtn} flex items-center`}>
              Home
            </NavLink>
            <NavLink
              to="/display"
              data-testid="navbar-display"
              className={`${linkbtn} flex items-center`}
            >
              Display
            </NavLink>
            <button onClick={toggleClass}>
              <div className="ItemLink group inline-flex h-10 w-[160px] items-center justify-start gap-0 rounded-lg py-2 pl-0 pr-0">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.0"
                  stroke="currentColor"
                  className=" mr-1 h-[18] stroke-current text-gray-500 group-hover:text-yellow-500 dark:text-[#f8f4eb] dark:group-hover:text-yellow-300"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.50488 10.7569C1.50488 16.4855 6.14803 21.1294 11.8756 21.1294C16.2396 21.1294 19.974 18.4335 21.5049 14.616C20.3104 15.0962 19.0033 15.3668 17.6372 15.3668C11.9095 15.3668 7.26642 10.7229 7.26642 4.99427C7.26642 3.63427 7.53299 2.3195 8.00876 1.12939C4.19637 2.66259 1.50488 6.39536 1.50488 10.7569Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="DarkMode font-normal leading-normal text-gray-900 group-hover:text-yellow-500 dark:text-[#f8f4eb] dark:group-hover:text-yellow-300 ">
                  {darkMode === true ? 'Light' : 'Dark'}
                </span>
              </div>
            </button>
          </div>
        </div>
        <div className="flex items-center justify-end items-center text-[clamp(12px,1.2vw,16px)] gap-1 shrink-0 whitespace-nowrap">
          {user ? (
            <>
              {/* inline-block: behave like an inline element but allows width and height modifications */}
              {/* pt: padding to top, dark:text-white: change text color to white in dark mode */}
              {/* lg: large screens, mt-0: margin-top: 0, on lg mode */}
              <span className="dark:text-[#f8f4eb]">{user.full_name}</span>
              {/* ml: margin left, mr: margin right, rounded-full: make the image circular, dark:invert: invert color in dark mode */}
              <img className="h-[clamp(18px,2.2vw,25px)] w-[clamp(18px,2.2vw,25px)] rounded-full invert" src={default_pfp} />
              <a
                onClick={() => signoutSession()}
                className="group flex cursor-pointer items-center rounded-lg font-normal text-gray-900 hover:text-yellow-500 dark:text-[#f8f4eb] dark:hover:text-yellow-300"
              >
                <SignOutIcon />
                <span className="flex-1 whitespace-nowrap">Sign Out</span>
              </a>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-base font-bold text-white">
                Login
              </NavLink>
              <img className="h-[20px] w-[20px] invert" src={login} />
            </>
          )}
        </div>
      </nav>
      <div className="h-[64px]"></div>
    </>
  );
}

export default Navbar;
