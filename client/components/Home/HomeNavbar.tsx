import React from "react";
import { Link, useNavigate } from "react-router-dom";

import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

interface HomeNavBarProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
}

export default function HomeNavbar({ user }: HomeNavBarProps) {
  const navigate = useNavigate();

  /*
  "logout" - a function that fetches data from "/logout" route; 
  it gets invoked when "LogOut" button is clicked and returns {logout: true | false}
  Once logout is successful, navigate/redirect to "/login" route;
  Leveraging localStorage for authentication status for component rendering;
  */
  function logout() {
    localStorage.setItem("isLoggedIn", "false");
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        navigate("/login");
      })
      .catch((err: {}) => {
        navigate("/login");
      });
  }

  return (
    <div>
      {localStorage.getItem("isLoggedIn") === "true" ? (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ bgcolor: "#2b3a42" }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Logo dbSpy
              </Typography>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={`/display/${user.id}`}
              >
                <Button color="inherit">My Canvas</Button>
              </Link>
              <Button color="inherit">Docs</Button>

              <Button color="inherit">Team</Button>

              <Link style={{ textDecoration: "none", color: "white" }} to={"/"}>
                <Button color="inherit" onClick={logout}>
                  Logout
                </Button>
              </Link>
            </Toolbar>
          </AppBar>
        </Box>
      ) : (
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static" sx={{ bgcolor: "#2b3a42" }}>
            <Toolbar>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Logo dbSpy
              </Typography>
              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={"/signup"}
              >
                <Button color="inherit">Free Demo</Button>
              </Link>
              <Button color="inherit">Docs</Button>

              <Button color="inherit">Team</Button>

              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={"/signup"}
              >
                <Button color="inherit">Sign Up</Button>
              </Link>

              <Link
                style={{ textDecoration: "none", color: "white" }}
                to={"/login"}
              >
                <Button color="inherit">Log In</Button>
              </Link>
            </Toolbar>
          </AppBar>
        </Box>
      )}
    </div>
  );
}
