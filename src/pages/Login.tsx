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
      // const strWindowFeatures =
    //   'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    // window.open('http://localhost:8080/oauth', '_self', strWindowFeatures);
  */
  const handleLogin = () => {
    const strWindowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    window.open('http://localhost:3000/api/oauth', '_self', strWindowFeatures);
    // fetch('/api/oauth')
    // // .then((res) => res.json())
    // .then(res => res.text())
    // .then((data) => console.log(data))
    // .catch((err) => console.log(err));
    // fetch('/api/oauth', {
    //   method: 'POST',
    //   mode: 'cors',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   // body: JSON.stringify('null'),
    // })
    // .then((res) => {
    //   if (res.ok) return res.json();
    //   else throw new Error('Authentication Failed');
    // })
    // .catch((e) => console.log(e));
    }


  return (
    <div className='grid h-80 place-items-center'>
   <button className='bg-red-600 hover:bg-red-700 text-stone-100 font-bold py-2 px-4 rounded inline-flex items-center' onClick={handleLogin}>
    <svg className="h-6 w-6 mr-2 text-white"  width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z"/>  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
    <span>Login with Google</span>
   </button>
   </div>
  );
}
