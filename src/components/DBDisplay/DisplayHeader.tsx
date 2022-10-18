// React & React Router & React Query Modules;
import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/logo5-white-100-rectangle.png";

// Components imported;
import MenuPopUp from "./MenuPopUp";
import useCredentialsStore from "../../store/credentialsStore";

// UI Libraries - Mantine
import { Header, Text, MediaQuery, Button, Image, Box } from "@mantine/core";



// D A R K M O D E 
import darkMode from '../../darkMode.js'


interface DisplayHeaderProps {
  menuPopUpOpened: boolean;
  name: string | null;
  picture: string | null | undefined;
  setMenuPopUpOpened: (opened: boolean) => void;
  setUser: (user: any) => void;
}

/** "DisplayHeader" Component - a header for DBDisplay page */
export default function DisplayHeader({
  menuPopUpOpened,
  name,
  picture,
  setMenuPopUpOpened,
  setUser,
  }: DisplayHeaderProps) {
  //STATE DECLARATION (dbSpy3.0)
  // const user = useCredentialsStore(state => state.user);
  // const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION


  const navigate = useNavigate();

  if (picture === null) picture = undefined;

  /** "logout" - a function that gets invoked when logout button is clicked on DBDisplay page; GET request to "/logout" path;
   * Receive a data with a format of {logout: true||false};
   * Redirect to main homepage upon both success and failure;
   */

  // Dark mode button display. 
  const currentTheme = localStorage.getItem('theme');
  const darkButtonState = currentTheme === 'light' || !currentTheme ? 'Dark Mode' : 'Light Mode'

  const logout = () => {
    sessionStorage.clear();
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        setUser({ name: null, email: null, id: null, picture: null });
        navigate("/");
      })
      .catch((err: {}) => {
        alert(`Logout failed. Error:${err}`);
        setUser({ name: null, email: null, id: null, picture: null });
        navigate("/");
      });
  };

  return (
    <Header height={60} p="xs" sx={{ backgroundColor: "#2b3a42" }}>
      <div className="DisplayHeaderHeader"
      >
  
        <div className="DisplayHeaderHeaderSub"
        >
          <MediaQuery 
          className="DisplayHeaderMediaQuery"
          largerThan="sm" 
          styles={{ display: "block" }}
          >
            <MenuPopUp
              opened={menuPopUpOpened}
              setOpened={setMenuPopUpOpened}
            />
          </MediaQuery>
          
          <Link to="/">
            <img src={logo} alt="Logo" />
          </Link>
          <Button className="darkMode" color="inherit" onClick={darkMode}>{darkButtonState}</Button>
        </div>

       

        <div className="DisplayHeaderHeaderSub1"

        >
        </div>

        <Box
          className="DisplayHeaderBox"
        >
          <Text 
          className="DisplayHeaderText">
            {" "}
            Welcome, {name == null ? " " : name.concat(" ")}{" "}
          </Text>
          <Image
            className="DisplayHeaderImage"
            radius="lg"
            src="https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png"
            alt="profile pic"
          />
          <Button
            className="DisplayHeaderButton"
            variant="outline"
            onClick={logout}>
            Sign Out
          </Button>
        </Box>
      </div>
    </Header>
  );
}
