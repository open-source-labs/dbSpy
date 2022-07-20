// React & React Router Modules
import React from 'react';
import { Link } from 'react-router-dom';

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

/* "Signup" Component - signup page for user creation */
export default function Signup() {
  /*
  "google" - a function that gets invoked when SIGN UP WITH GOOGLE button is clicked;
  Opens up "http://localhost:8080/auth/google", the page that asks for authorization for server to receive access token from Google;
  */
  const google = () => {
    const strWindowFeatures =
      'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    window.open('/auth/google', '_self', strWindowFeatures);
  };

  /*
  "handleSubmit" - a function that gets invoked when SIGN UP button is clicked with user info.
  Event is currently prevented with event.preventDefault() method
  */
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
      firstName: data.get('firstName'),
      lastName: data.get('lastName'),
      company: data.get('company'),
      allowExtraEmails: data.get('extraemail'),
    });
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
            Sign up
          </Typography>

          <br />
          <br />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            {/* Google & GitHub OAuth */}

            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                flex: 1.25,
              }}
            >
              <Button
                sx={{
                  borderRadius: 50,
                  padding: '25px 36px',
                  width: '270px',
                  fontSize: '14px',
                }}
                variant="contained"
                color="secondary"
                startIcon={<GoogleIcon />}
                onClick={google}
              >
                Sign up with Google
              </Button>

              {/* <Button
                sx={{
                  marginTop: 5,
                  borderRadius: 5,
                  padding: "25px 36px",
                  width: "270px",
                  fontSize: "14px",
                }}
                variant="contained"
                color="secondary"
                startIcon={<GitHubIcon />}
              >
                Sign up with GitHub
              </Button> */}
            </Box>

            {/* Submit Form for SIGN UP */}

            {/* <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 5, pl: 5, flex: 1 }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    id="company"
                    label="Company (Optional)"
                    name="company"
                    autoComplete="company"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        name="extraemail"
                        value="true"
                        color="primary"
                      />
                    }
                    label="I want to receive product promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>

              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link to="/login">Already have an account? Sign in</Link>
                </Grid>
              </Grid>
            </Box> */}
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}
