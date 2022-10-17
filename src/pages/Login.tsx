// React & React Router Modules
import React from 'react';
import { Link } from 'react-router-dom';

//state management component
import useCredentialsStore from '../store/credentialsStore';

// UI components from MUI
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';

// Icon components from MUI
import CloseIcon from '@mui/icons-material/Close';
import GoogleIcon from '@mui/icons-material/Google';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { IconButton } from '@mui/material';

/* Copyright component that is used as a footer for login page */
function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" to="/">
        dbSpy
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

/* styling theme set up for login page */
const theme = createTheme({
  palette: {
    primary: {
      main: '#2b3a42',
    },
    secondary: {
      main: '#2b3a42',
    },
    background: {
      default: '#fcfcfcfa',
    },
  },
});

// const strWindowFeatures =
// 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
// window.open('http://localhost:8080/auth/google', '_self', strWindowFeatures);

/* "Login" Component - login page for user login */
export default function Login() {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION


  /*
  "google" - a function that gets invoked when Google login button is clicked;
  Opens up "http://localhost:8080/auth/google", the page that asks for authorization for server to receive access token from Google;
  */
  const google = () => {
    const strWindowFeatures =
      'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    window.open('http://localhost:8080/oauth', '_self', strWindowFeatures);

  };


  return (
    <ThemeProvider theme={theme}>
      {/* Closing Button X on right top */}
      <Link to="/">
        <IconButton
          aria-label="delete"
          color="primary"
          sx={{
            position: 'absolute',
            right: '50px',
            top: '50px',
          }}
        >
          <CloseIcon sx={{ fontSize: '50px' }} />
        </IconButton>
      </Link>

      <Container component="main" maxWidth="md">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Welcome Back!
          </Typography>
 

          {/* Google & GitHub OAuth buttons */}
          <br />
          <br />

          <Box>
            <Button
              onClick={google}
              sx={{
                borderRadius: 50,
                padding: '25px 36px',
                margin: '0px 5px',
                fontSize: '14px',
                width: '270px',
              }}
              variant="contained"
              color="secondary"
              startIcon={<GoogleIcon fontSize="large" />}
            >
              LOGIN WITH GOOGLE
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
