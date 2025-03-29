import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
import logo from '../assets/newLogoWhite.png';
import login from '../assets/right-to-bracket-solid.svg';
import default_pfp from '../assets/default_pfp.svg';

// Images for logo animation db 7.0
//import logo from '../../assets/newLogoWhite.png';
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
  //STATE DECLARATION (dbSpy3.0)
  const [theme, setTheme] = useState('Dark');
  const { user } = useCredentialsStore((state): any => state);
  //END: STATE DECLARATION

  //Create logo button hover over animation - dbSpy 7.0
  let ImgSwap: NodeJS.Timeout;
  function logoImageFlow(event: any) {
    //let currentLogoImg = event.target.src;
    let logoImgArr: string[];

      logoImgArr = [
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
        logo,
      ];

    let currIndex = 0;
    ImgSwap = setInterval(function () {
      if (currIndex > 12) {
        currIndex = 0;
      }
      event.target.src = logoImgArr[currIndex];
      currIndex++;
    }, 130); // Adjust the timeout value between image swaps as needed
  }
  // function to clean up after the hover over affect. Must clear the interval set by setInterval() - dbSpy 7.0
  function clearImgSwap(event: any) {
      event.target.src = logo;
    clearInterval(ImgSwap);
  }

  return (
    <>
      <nav className="fixed top-0 flex w-full flex-wrap items-center justify-between  bg-sky-800 p-2">
        <div className="navItems text-base">
          <img className="mr-5 inline-block h-[45] fill-current" src={logo} alt="Logo"
                onMouseOver={logoImageFlow} 
                onMouseOut={clearImgSwap} />
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
