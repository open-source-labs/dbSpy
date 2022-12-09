// React & React Router Modules
import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
// Opens up the page that asks for authorization for server to receive access token from Google;
import { handleOAuthLogin } from '../utils/getGoogleUrl'

/* "Login" Component - login page for user login */
export default function Login() {
  //STATE DECLARATION (dbSpy3.0)
  const { setUser } = useCredentialsStore();
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(true)
  //END: STATE DECLARATION

  //Regular login using JWTs without OAuth  
  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    const userLogin = {
      email: e.target.email.value,
      password: e.target.password.value
    }
    axios.post('/api/verifyUser', userLogin)
      .then(res => {
        setUser(res.data);
        navigate('/display');
      })
      .catch(err => {
        setLoginStatus(false);
        for (const ele of document.getElementsByTagName('input')) {
          ele.style.border = 'solid 1px red'
        }
      })
  }

  return (
    <div className='mt-10 grid place-items-center'>
      <h1 className="mt-10 text-3xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-2xl"><span className="text-transparent bg-clip-text text-sky-700">Sign in</span> to your account</h1>
      <div className='mb-3 text-sm dark:text-white'>
        Don't have an account yet? <span className='text-gray-400 font-semibold hover:text-gray-300 active:text-gray-500'><NavLink to='/signup'>Sign up</NavLink></span>
      </div>
      <div className=''>
        <form className="w-full max-w-sm" onSubmit={(e) => handleLogin(e)}>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Email
              </label>
            </div>
            <div className="md:w-2/3">
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500 err:focus:border-red-700" type='email' id='email' name='email' placeholder="example@email.com" required></input>
            </div>
          </div>
          <div className={"md:flex md:items-center " + (loginStatus ? 'mb-6' : 'mb-2')}>
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Password
              </label>
            </div>
            <div className="md:w-2/3">
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500" type="password" name='password' id='password' placeholder="******************" required></input>
            </div>
          </div>
          {loginStatus === false ? <p className='text-xs md:text-center text-red-700 mb-2'>Incorrect username/password</p> : null}
          <div className="md:flex justify-center">
            <button className="shadow bg-sky-700 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
              Sign In
            </button>

          </div>
        </form>
        <div className="inline-flex justify-between items-center w-full">
          <hr className="my-8 w-32 h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <span className="absolute left-1/2 px-3 font-medium text-gray-900 -translate-x-1/2 dark:text-white dark:bg-slate-700">or</span>
          <hr className="my-8 w-32 h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
        </div>
      </div>
      <div className="w-h sm:w-1/2 sm:pl-2 inline-flex justify-center">
        <button className='bg-red-600 hover:bg-red-700 text-stone-100 py-1 px-4 inline-flex items-center' onClick={handleOAuthLogin}>
          <svg className="h-4 w-4 mr-2 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
          <span>Login with Google</span>
        </button>
      </div>
      {/* <button className='bg-red-600 hover:bg-red-700 text-stone-100 font-bold py-2 px-4 rounded inline-flex items-center' onClick={handleOAuthLogin}>
        <svg className="h-6 w-6 mr-2 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
        <span>Login with Google</span>
      </button> */}
    </div>
  );
}
