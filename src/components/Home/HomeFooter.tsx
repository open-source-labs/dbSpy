import React from "react";
import { Link } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import logo from "../../assets/logo5-white-100-rectangle.png";

export default function HomeFooter() {
  return (
    <Box sx={{flexGrow: 1}}>
      <AppBar sx={{top: "auto", bottom: "0", bgcolor: "#2b3a42", left: "0", position: "unset"}}>
        <Toolbar>
          
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <img src={logo} alt="Logo" />
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  )
}
