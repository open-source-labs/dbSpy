import React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";

import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import GitHubIcon from "@mui/icons-material/GitHub";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { IconButton } from "@mui/material";
import { Link } from "react-router-dom";

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



export default function Login() {

  const google = ()=> { 

    
    const strWindowFeatures =
     'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';

    window.open("http://localhost:8080/auth/google", '_self', strWindowFeatures);

    
  

    console.log("clicked window ");
};
    
  



  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get("email"),
      password: data.get("password"),
    });
  };

  return (
    <ThemeProvider theme={theme}>
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

          {/* <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          > */}

          {/* <Typography sx={{ mr: 0, ml: 0, textAlign: "center" }}>
              or...
            </Typography> */}

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
                      <Checkbox value="allowExtraEmails" color="primary" />
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
                login
              </Button>

              {/* </Box> */}
            </Grid>
          </Box>

          <Typography sx={{ mb: 2, mt: 5, textAlign: "center" }}>
            or sign in with:
          </Typography>

          <Box>
            <Button onClick={google}
              sx={{
                borderRadius: 50,
                // padding: "25px 36px",
                padding: "25px 25px",
                margin: "0px 5px",
                // width: "200px",
                fontSize: "14px",
              }}
              variant="contained"
              color="secondary"
              //   startIcon={<GoogleIcon />}
            >
              <GoogleIcon fontSize="large" />
            </Button>
            <Button
              sx={{
                borderRadius: 50,
                // padding: "25px 36px",
                padding: "25px 25px",
                margin: "0px 5px",
                // width: "200px",
                fontSize: "14px",
              }}
              variant="contained"
              color="secondary"
              //   startIcon={<GitHubIcon />}
            >
              <GitHubIcon fontSize="large" />
            </Button>
          </Box>

          <Link to="/signup">Don't have an account?</Link>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
