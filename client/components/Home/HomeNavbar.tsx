import React from "react";
import { Link } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';


export default function HomeNavbar() {
  return (
      <Box sx={{flexGrow: 1}}>
        <AppBar position="static" sx={{bgcolor: '#2b3a42'}}>
          <Toolbar>
           
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Logo dbSpy
            </Typography>
            <Link style={{textDecoration: 'none', color: "white" }} to={"/login"} >
              <Button color="inherit">Free Demo</Button>
              
            </Link>
            <Button color="inherit">Docs</Button>
            
            <Button color="inherit">Team</Button>
            
            
            <Link style={{textDecoration: 'none', color: "white" }} to={"/login"}>
              <Button color="inherit">Log In</Button>
            </Link>
            
            <Link style={{textDecoration: 'none', color: "white" }} to={"/signup"}>
              
              <Button color="inherit">Sign In</Button>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
    
  );
}
