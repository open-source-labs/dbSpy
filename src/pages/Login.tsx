// React & React Router Modules
import React from 'react';
import { NavLink } from 'react-router-dom';
import { getGoogleAuthUrl } from '../utils/getGoogleUrl'


/* "Login" Component - login page for user login */
export default function Login() {
  //STATE DECLARATION (dbSpy3.0)
  //END: STATE DECLARATION

  //Regular login using JWTs without OAuth  
  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Login Submitted')
  }

  /*
  "google" - a function that gets invoked when Google login button is clicked;
  Opens up the page that asks for authorization for server to receive access token from Google;
  */
  const handleOAuthLogin = async () => {
    // TODO: Double check await necessity
    const url = await getGoogleAuthUrl();
    const strWindowFeatures = 'toolbar=no, menubar=no, width=600, height=700, top=100, left=100';
    window.open(url, '_self', strWindowFeatures);
  }

  return (
    <div className='grid h-80 place-items-center'>
      <div>
        <h3>Please Log In</h3>
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type='email' name='email' placeholder='Email' required></input>
          <input type='password' name='panpm ssword' placeholder='Password' required></input>
          <input type='submit'></input>
        </form>
        <span>
          Not a user?
          <NavLink to='/signup' >Create an Account!</NavLink>
        </span>
      </div>

      <button className='bg-red-600 hover:bg-red-700 text-stone-100 font-bold py-2 px-4 rounded inline-flex items-center' onClick={handleOAuthLogin}>
        <svg className="h-6 w-6 mr-2 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
        <span>Login with Google</span>
      </button>
    </div>
  );
}
