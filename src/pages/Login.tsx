// React & React Router Modules
import React, { useState } from 'react';
import {getGoogleAuthUrl} from '../utils/getGoogleUrl'

//state management component
import useCredentialsStore from '../store/credentialsStore';

/* "Login" Component - login page for user login */
export default function Login() {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore((state: { user: any; }) => state.user);
  const setUser = useCredentialsStore((state: { setUser: any; }) => state.setUser);
  //END: STATE DECLARATION
  const [loggedIn, setLoggedIn] = useState(false)

  /*
  "google" - a function that gets invoked when Google login button is clicked;
  Opens up the page that asks for authorization for server to receive access token from Google;
  */
  const handleLogin = async () => {
    const url = await getGoogleAuthUrl();
    const strWindowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    window.open(url , '_self', strWindowFeatures);
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
