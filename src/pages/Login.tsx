// React & React Router Modules
import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
// Opens up the page that asks for authorization for server to receive access token from Google;
import { handleOAuthLogin } from '../utils/getGoogleUrl';

/* "Login" Component - login page for user login */
export default function Login() {
  //STATE DECLARATION (dbSpy3.0)
  const { setUser } = useCredentialsStore();
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(true);
  //END: STATE DECLARATION

  //Regular login using JWTs without OAuth
  const handleLogin = (e: React.FormEvent): void => {
    e.preventDefault();
    const userLogin = {
      email: e.target.email.value,
      password: e.target.password.value,
    };
    axios
      .post('/api/verifyUser', userLogin)
      .then((res) => {
        setUser(res.data);
        navigate('/display');
      })
      .catch((err) => {
        setLoginStatus(false);
        for (const ele of document.getElementsByTagName('input')) {
          ele.style.border = 'solid 1px red';
        }
      });
  };

///////////////////////////OAUTH//////////////

type Options = {
  redirect_uri: string,
  client_id: string,
  access_type: string,
  response_type: string,
  prompt: string,
  scope:string,
}

function getGoogle():void{

  const rootUrl:string = 'https://accounts.google.com/o/oauth2/v2/auth';

  const options:Options = {
    redirect_uri: 'http://localhost:8080/display',
    client_id: '507124943654-nd7fhcdfvmendo2ntsrpj0pifg7paa36.apps.googleusercontent.com',
    access_type: 'offline',
    response_type: 'code',
    prompt: 'consent',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email',
    ].join(' '),
  };
  const qs = new URLSearchParams(options);
  const url = `${rootUrl}?${qs.toString()}`;

  const strWindowFeatures =
    'toolbar=no, menubar=no, width=600, height=700, top=100, left=800';
  window.open(url, '_self', strWindowFeatures);

}

///////////////////OAUTH/////////////
  return (
    <div className="mt-10 grid place-items-center">
      <h1 className="mt-10 text-3xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-2xl">
        <span className="bg-clip-text text-transparent text-sky-700">Sign in</span> to
        your account
      </h1>
      <div className="mb-3 text-sm dark:text-white">
        Don't have an account yet?{' '}
        <span className="font-semibold text-gray-400 hover:text-gray-300 active:text-gray-500">
          <NavLink to="/signup">Sign up</NavLink>
        </span>
      </div>
      <div className="">
        <form className="w-full max-w-sm" onSubmit={(e) => handleLogin(e)}>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                Email
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="err:focus:border-red-700 w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none"
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                required
              ></input>
            </div>
          </div>
          <div className={'md:flex md:items-center ' + (loginStatus ? 'mb-6' : 'mb-2')}>
            <div className="md:w-1/3">
              <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                Password
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 py-2 px-4 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="******************"
                required
              ></input>
            </div>
          </div>
          {loginStatus === false ? (
            <p className="mb-2 text-xs text-red-700 md:text-center">
              Incorrect username/password
            </p>
          ) : null}
          <div className="justify-center md:flex">
            <button
              className="focus:shadow-outline rounded bg-sky-700 py-2 px-4 font-bold text-white shadow hover:bg-indigo-400 focus:outline-none"
              type="submit">
              Sign In
            </button>
          </div>
        </form>
        <button
              className="focus:shadow-outline rounded bg-sky-700 py-2 px-4 font-bold text-white shadow hover:bg-indigo-400 focus:outline-none" onClick={()=>getGoogle()}>
              Login Google
        </button>
        {/* TODO: implement production level Google OAuth */}
        {/* <div className="inline-flex w-full items-center justify-between">
          <hr className="my-8 h-px w-32 border-0 bg-gray-200 dark:bg-gray-700"></hr>
          <span className="absolute left-1/2 -translate-x-1/2 px-3 font-medium text-gray-900 dark:bg-slate-700 dark:text-white">
            or
          </span>
          <hr className="my-8 h-px w-32 border-0 bg-gray-200 dark:bg-gray-700"></hr>
        </div> */}
      </div>
      {/* <div className="w-h sm:w-1/2 sm:pl-2 inline-flex justify-center">
        <button className='bg-red-600 hover:bg-red-700 text-stone-100 py-1 px-4 inline-flex items-center' onClick={handleOAuthLogin}>
          <svg className="h-4 w-4 mr-2 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
          <span>Login with Google</span>
        </button>
      </div> */}
    </div>
  );
}
