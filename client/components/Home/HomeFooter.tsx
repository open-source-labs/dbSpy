import React from "react";
import { Link } from "react-router-dom";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

export default function HomeFooter() {
  return (
    <Box sx={{flexGrow: 1}}>
        <AppBar position="static" sx={{bgcolor: '#2b3a42'}}>
          <Toolbar>
           
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              dbSpy
            </Typography>
            <Link style={{textDecoration: 'none', color: "white" }} to={"/"}>
              
              <Button color="inherit">About Us</Button>
            </Link>
          </Toolbar>
        </AppBar>
      </Box>
  )
}
