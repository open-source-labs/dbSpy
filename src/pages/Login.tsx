// React & React Router Modules
import React from 'react';
import { getGoogleAuthUrl } from '../utils/getGoogleUrl'
import useCredentialsStore from '../store/credentialsStore';

/* "Login" Component - login page for user login */
export default function Login() {
  //STATE DECLARATION (dbSpy3.0)
  //END: STATE DECLARATION

  // Temp state stuck at true
  const { registrationPage, setRegistrationPage } = useCredentialsStore((state) => state);

  const greeting = !registrationPage
    ? <h3>Please Log In</h3>
    : <h3>Please Register</h3>

  /*
  Register an account page trigger
  */
  const toggleRegister = (e: React.FormEvent): void => {
    e.preventDefault();
    console.log('Register Status:', registrationPage);
    setRegistrationPage();
  }

  /*
  Regular login using JWTs without OAuth
  */
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
        {greeting}
        <form onSubmit={(e) => handleSubmit(e)}>
          <input type='text'></input>
          <input type='password'></input>
          <input type='submit'></input>
        </form>

        {!registrationPage
          ? <span>
            Not a user?
            <button onClick={(e) => toggleRegister(e)}>Create an account!</button>
          </span>
          : <span>
            Return to login
            <button onClick={(e) => toggleRegister(e)}>Cancel</button>
          </span>}
      </div>

      <button className='bg-red-600 hover:bg-red-700 text-stone-100 font-bold py-2 px-4 rounded inline-flex items-center' onClick={handleOAuthLogin}>
        <svg className="h-6 w-6 mr-2 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
        <span>Login with Google</span>
      </button>
    </div>
  );
}
