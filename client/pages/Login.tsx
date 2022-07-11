// React & React Router Modules
import React from "react";
import { Link } from "react-router-dom";

// UI components from MUI
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Container from "@mui/material/Container";
import CssBaseline from "@mui/material/CssBaseline";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

// Icon components from MUI
import CloseIcon from "@mui/icons-material/Close";
import GitHubIcon from "@mui/icons-material/GitHub";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { IconButton } from "@mui/material";

/* Copyright component that is used as a footer for login page */
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" to="/">
        dbSpy
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

/* styling theme set up for login page */
const theme = createTheme({
  palette: {
    primary: {
      main: "#2b3a42",
    },
    secondary: {
      main: "#2b3a42",
    },
    background: {
      default: "#fcfcfcfa",
    },
  },
});

/* "Login" Component - login page for user login */
export default function Login() {
  /*
  "google" - a function that gets invoked when Google login button is clicked;
  Opens up "http://localhost:8080/auth/google", the page that asks for authorization for server to receive access token from Google;
  */
  const google = () => {
    const strWindowFeatures =
      "toolbar=no, menubar=no, width=600, height=700, top=100, left=100";
    window.open(
      "http://localhost:8080/auth/google",
      "_self",
      strWindowFeatures
    );
  };

  /*
  "handleSubmit" - a function that gets invoked when LOGIN button is clicked with user credentials.
  Event is currently prevented with event.preventDefault() method
  */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    if (data.get("email") === "") alert("Email is missing");
    else if (data.get("password") === "") alert("Password is missing");
    else {
      console.log({
        email: data.get("email"),
        password: data.get("password"),
        rememberMe: data.get("checked"),
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      {/* Closing Button X on right top */}
      <Link to="/">
        <IconButton
          aria-label="delete"
          color="primary"
          sx={{
            position: "absolute",
            right: "50px",
            top: "50px",
          }}
        >
          <CloseIcon sx={{ fontSize: "50px" }} />
        </IconButton>
      </Link>

      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome Back!
          </Typography>

          {/* Submit Form for login credentials */}
          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 5, width: "50%" }}
          >
            <Grid container spacing={0}>
              <Grid item xs={16} marginBottom={2}>
                <TextField
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  color="primary"
                  autoFocus
                />
              </Grid>
              <Grid item xs={16} marginBottom={2}>
                <TextField
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type="password"
                  id="password"
                  autoComplete="new-password"
                  color="primary"
                />
              </Grid>

              <Grid
                container
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Grid item>
                  <FormControlLabel
                    control={
                      <Checkbox name="checked" value="true" color="primary" />
                    }
                    label="Remember me?"
                  />
                </Grid>
                <Grid item>
                  <Link to="#">Forgot Password?</Link>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                LOGIN
              </Button>
            </Grid>
          </Box>

          <Typography sx={{ mb: 2, mt: 5, textAlign: "center" }}>
            or sign in with:
          </Typography>

          {/* Google & GitHub OAuth buttons */}
          <Box>
            <Button
              onClick={google}
              sx={{
                borderRadius: 50,
                padding: "25px 25px",
                margin: "0px 5px",
                fontSize: "14px",
              }}
              variant="contained"
              color="secondary"
            >
              <GoogleIcon fontSize="large" />
            </Button>

            <Button
              sx={{
                borderRadius: 50,
                padding: "25px 25px",
                margin: "0px 5px",
                fontSize: "14px",
              }}
              variant="contained"
              color="secondary"
            >
              <GitHubIcon fontSize="large" />
            </Button>
          </Box>

          <br />
          <Link to="/signup">Don't have an account?</Link>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
