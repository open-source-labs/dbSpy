import React from "react";
import { Link, useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../assets/logo5-white-100-rectangle.png";

interface HomeLoggedInNavbarProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  setUser: (user: any) => void;
}

export default function HomeLoggedInNavbar({
  user,
  setUser,
}: HomeLoggedInNavbarProps) {
  const navigate = useNavigate();

  /*
    "logout" - a function that fetches data from "/logout" route; 
    it gets invoked when "LogOut" button is clicked and returns {logout: true | false}
    Once logout is successful, navigate/redirect to "/login" route;
    Leveraging localStorage for authentication status for component rendering;
    */
  function logout() {
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        setUser({ name: null, email: null, id: null, picture: null });
        navigate("/login");
      })
      .catch((err: {}) => {
        setUser({ name: null, email: null, id: null, picture: null });
        navigate("/login");
      });
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#2b3a42" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
             <img src={logo} alt="Logo" />
          </Typography>
          <Link
            className="HomeLoggedInNavbarLink"
            // style={{ textDecoration: "none", color: "white" }}
            to={`/display/access/${user.id}`}
          >
            <Button color="inherit">My Canvas</Button>
          </Link>
          <Button 
            color="inherit">
            <a className="HomeLoggedInNavbarA" 
            // style={{ textDecoration: "none", color: "white" }}
            href="https://www.github.com/oslabs-beta/dbSpy/blob/dev/README.md">Docs</a>
            
          </Button>

          {/* <Button color="inherit">Team</Button> */}

          <Link 
          className="HomeLoggedInNavbarLink"
          // style={{ textDecoration: "none", color: "white" }} 
          to={"/"}>
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
