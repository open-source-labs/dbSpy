// React & React Router Modules
import React, { useState } from 'react';
import axios from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
// Opens up the page that asks for authorization for server to receive access token from Google;
import { handleOAuthLogin } from '../utils/getGoogleUrl';
import googleImg from '../../src/assets/GoogleImage.png';
import gitHubImage from '../../src/assets/GithubImage.png';
import { set } from 'cypress/types/lodash';

/* "Login" Component - login page for user login */
export default function Login() {
  //STATE DECLARATION (dbSpy3.0)
  const { setUser } = useCredentialsStore();
  const navigate = useNavigate();
  const [loginStatus, setLoginStatus] = useState(true);
  // STATE DECLARATION (dbSpy6.0)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inputError, setInputError] = useState(false);
  //END: STATE DECLARATION

  //Regular login using JWTs without OAuth
  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    const userLogin = { email, password };
    try {
      const res = await axios.post('/api/verifyUser', userLogin, {
        withCredentials: true,
      });
      setUser(res.data);
      navigate('/display');
    } catch (err) {
      setLoginStatus(false);
      setInputError(true);
    }
  };

  ///////////////////////////OAUTH//////////////

  type Options = {
    redirect_uri: string;
    client_id: string;
    access_type?: string;
    response_type?: string;
    prompt?: string;
    scope: string;
    state?: string;
    allow_signup?: string;
  };

  function getGoogle(): void {
    const rootUrl: string = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options: Options = {
      redirect_uri: 'http://localhost:8080/display/',
      client_id:
        '507124943654-nd7fhcdfvmendo2ntsrpj0pifg7paa36.apps.googleusercontent.com',
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

  // old client id: d44f1421ff7324a4468d
  const getGithub = (): void => {
    const rootUrl: string = 'https://github.com/login/oauth/authorize';
    const options: Options = {
      redirect_uri: 'http://localhost:8080/display/',
      client_id: '18d4ecdcc6ed1cb25240',
      state: 'randomstring',
      allow_signup: 'true',
      scope: ['read:user', 'user:email'].join(' '),
    };
    const qs = new URLSearchParams(options);
    const url = `${rootUrl}?${qs.toString()}`;
    console.log(url);

    const strWindowFeatures =
      'toolbar=no, menu=no, width=600, height=700, top=100, left=800';
    window.open(url, '_self', strWindowFeatures);
  };

  ///////////////////OAUTH/////////////
  return (
    <div className="mt-10 grid place-items-center">
      <h1 className="mt-10 text-3xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-2xl">
        Sign into your account
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
                className={`w-full appearance-none rounded border-2 ${
                  inputError ? 'border-red-700' : 'border-gray-200'
                } bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none`}
                type="email"
                id="email"
                name="email"
                value={email}
                placeholder="example@email.com"
                onChange={(e) => setEmail(e.target.value)}
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
                className={`w-full appearance-none rounded border-2 ${
                  inputError ? 'border-red-700' : 'border-gray-200'
                } bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none`}
                type="password"
                name="password"
                id="password"
                value={password}
                placeholder="******************"
                onChange={(e) => setPassword(e.target.value)}
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
              className="focus:shadow-outline rounded bg-sky-700 px-4 py-2 font-bold text-white shadow hover:bg-indigo-400 focus:outline-none"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <button
          className="ml-1 mr-1 inline-flex items-center bg-red-600 px-4 py-1 text-white hover:text-cyan-950"
          onClick={() => getGoogle()}
        >
          <img src={googleImg} alt="google logo" className="mr-1 h-5 "></img>
          Sign in with Google
        </button>
        <button
          className="ml-1 inline-flex items-center bg-black px-4 py-1 text-white hover:text-cyan-950"
          onClick={() => getGithub()}
        >
          <img src={gitHubImage} alt="github logo" className="mr-1 h-5 "></img>
          Sign in with GitHub
        </button>
      </div>
    </div>
  );
}
