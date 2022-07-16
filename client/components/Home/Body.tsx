import React from "react";
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Link } from "react-router-dom";

const styles:object = {
  display: "flex",
  justifyContent: "space-evenly", alignItems: "center", 
  border: "2px black solid",
  borderRadius: "25px",
  margin: "20px",
  padding: "30px"
}

const lorem = "";
// 'Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.'

export default function Body() {
  return (
    
  <div className="mainContainer" style={{display: "flex", flexDirection: "column", fontFamily:"Geneva", width: "50vw", margin:"auto", height: "100%"}}>
      <div style={styles} className="container">
        dbSpy Demo
        <br /> 
        {lorem}
      </div>
      <div style={styles} className="container">
        Why us? 
        <br /> 
        {lorem}
      </div>
      <div style={styles} className="container">
        What our users say
        <br />
        {lorem}
      </div>
      <div style={styles} className="container">
        Latest Updates
        <br />
        {lorem}
      </div>
      <div style={styles} className="container">
        Meet the team
        <br /> 
      </div>
      {/* <footer style={{top: "auto", bottom: "0", backgroundColor: "#2b3a42", position: 'fixed', left: "0", width: "100%"}}>
        <Toolbar>
           
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              dbSpy
            </Typography>
            <Link style={{textDecoration: 'none', color: "white" }} to={"/"}>
              
              <Button color="inherit">About Us</Button>
            </Link>
          </Toolbar>
      </footer> */}
  </div>
  )
}
