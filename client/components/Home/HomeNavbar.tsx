import React from "react";
import { Link, useNavigate } from "react-router-dom";
   
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import logo from "../../assets/logo5-white-100-rectangle.png";
import darkMode from '../../darkMode.js'




export default function HomeNavbar() {


  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ bgcolor: "#2b3a42" }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="Logo" />
            <Button className="darkMode" color="inherit" onClick={darkMode}>Dark Mode</Button>
          </Typography>

         
        
          <Link className="homeNavBar-linkSignUp"
            // style={{ textDecoration: "none", color: "white" }}
            to={"/signup"}>
            <Button color="inherit">Free Demo</Button>
          </Link>

          <Button 
            color="inherit">
            <a className="homeNavBar-aDocs"
            // style={{ textDecoration: "none", color: "white" }}
            href="https://www.github.com/oslabs-beta/dbSpy/blob/dev/README.md">Docs</a>
            
          </Button>
          
          {/* <Button color="inherit">Team</Button> */}

          <Link className="homeNavBar-LinkSignUp"
            // style={{ textDecoration: "none", color: "white" }}
            to={"/signup"}
          >
            <Button color="inherit">Sign Up</Button>
          </Link>

          <Link className="homeNavBar-LinkLogin"
            // style={{ textDecoration: "none", color: "white" }}
            to={"/login"}
          >
            <Button color="inherit">Log In</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </Box>
  );
  
}
