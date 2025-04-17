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

  type Options = {
    redirect_uri: string;
    client_id?: string;
    access_type?: string;
    response_type?: string;
    prompt?: string;
    scope: string;
    state?: string;
    allow_signup?: string;
  };

  // in development mode, change redirect_uri to 'http://localhost:8080/display/'
  // in production mode, change redirect_uri back to 'https://dbspy.net/display/' before deploying
  function getGoogle(): void {
    const rootUrl: string = 'https://accounts.google.com/o/oauth2/v2/auth';

    const options: Options = {
      redirect_uri: 'http://localhost:8080/display/',
      client_id:
        '320130847932-1e4r2g6d0cd0etfin12agg9pb5mc0tn7.apps.googleusercontent.com',
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

  const getGithub = (): void => {
    const rootUrl: string = 'https://github.com/login/oauth/authorize';
    const options: Options = {
      redirect_uri: 'https://www.dbspy.net/auth/github/callback',
      // TODO - figure out way to hide client_id, dotenv doesn't work in React components on FE
      client_id: 'Ov23li1zd9jvrvT4aT5F',
      state: 'randomstring',
      allow_signup: 'true',
      scope: ['read:user', 'user:email'].join(' '),
    };

    const state = 'randomstring';
    const qs = new URLSearchParams({ ...options, state });
    const url = `${rootUrl}?${qs.toString()}`;
    console.log(url);

    const strWindowFeatures =
      'toolbar=no, menu=no, width=600, height=700, top=100, left=800';
    window.open(url, '_self', strWindowFeatures);
  };

  return (
    <div className="Content h-150 w-150 mx-auto mt-20 grid max-w-screen-md place-items-center gap-6">
      <div className="Header flex h-20 flex-col items-center justify-start gap-6 self-stretch">
        <div className="TextAndSupportingText flex h-20 flex-col items-start justify-start gap-3 self-stretch">
          <div className="Text self-stretch text-center text-3xl font-semibold leading-9 dark:text-white">
            Log in to your account
          </div>
          <div className="SupportingText self-stretch text-center text-base font-normal leading-normal dark:text-white">
            Welcome back! Please enter your details.
          </div>
        </div>
      </div>
      <div className="Content flex h-96 flex-col items-center justify-start gap-6 self-stretch rounded-xl">
        <form
          className="Form flex h-40 flex-col items-start justify-start gap-4 self-stretch"
          onSubmit={(e) => handleLogin(e)}
        >
          <div className="InputField flex h-11 flex-col items-start justify-start gap-1.5 self-stretch">
            <div className="InputWithLabel flex h-11 flex-col items-start justify-start gap-1.5 self-stretch">
              <div className="Input inline-flex items-center justify-start gap-2 self-stretch rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow">
                <div className="Content flex h-6 shrink grow basis-0 items-center justify-start gap-2">
                  <input
                    placeholder="Enter your email"
                    className="Text shrink grow basis-0 text-base font-normal leading-normal text-gray-500"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="InputField flex h-11 flex-col items-start justify-start gap-1.5 self-stretch">
            <div className="InputWithLabel flex h-11 flex-col items-start justify-start gap-1.5 self-stretch">
              <div className="Input inline-flex items-center justify-start gap-2 self-stretch rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow">
                <div className="Content flex h-6 shrink grow basis-0 items-center justify-start gap-2">
                  <input
                    placeholder="Enter your password"
                    className="Text shrink grow basis-0 text-base font-normal leading-normal text-gray-500"
                    type="password"
                    name="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    value={password}
                    required
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="Button inline-flex h-10 items-center justify-center gap-2 self-stretch rounded-lg bg-sky-800 px-4 py-2.5 shadow">
            <button
              className="Text text-base font-semibold leading-normal text-white"
              type="submit"
            >
              Continue with email
            </button>
          </div>
          <div className="flex w-full justify-center text-center">
            {!loginStatus ? (
              <div className="text-xs text-red-500">Failed to log in. Try again.</div>
            ) : null}
          </div>
        </form>
        <div className="ContentDivider inline-flex h-5 items-center justify-start gap-2 self-stretch">
          <div className="Divider h-px shrink grow basis-0 bg-gray-200" />
          <div className="Text text-center text-sm font-medium leading-tight dark:text-white">
            OR
          </div>
          <div className="Divider h-px shrink grow basis-0 bg-gray-200" />
        </div>
        <div className="SocialButtonGroups flex h-36 flex-col items-center justify-center gap-3 self-stretch">
          <button
            className="SocialButton inline-flex items-center justify-center gap-3 self-stretch rounded-lg border border-gray-300 bg-white px-4 py-2.5 shadow"
            onClick={() => getGoogle()}
          >
            <img
              src={googleImg}
              alt="google logo"
              className="SocialIcon relative h-6 w-6"
            />
            <div className="Text text-base font-semibold leading-normal text-slate-700">
              Continue with Google
            </div>
          </button>
          <button
            className="SocialButton inline-flex items-center justify-center gap-3 self-stretch rounded-lg border border-gray-300 bg-white px-4 py-2.5 shadow"
            onClick={() => getGithub()}
          >
            <img
              src={gitHubImage}
              alt="github logo"
              className="SocialIcon relative h-6 w-6"
            />
            <div className="Text text-base font-semibold leading-normal text-slate-700 hover:text-cyan-950">
              Continue with GitHub
            </div>
          </button>
          <div className="Github142SvgrepoCom1 relative h-9 w-9" />
        </div>
      </div>
      <div className="Row inline-flex h-5 items-start justify-center gap-1 self-stretch">
        <div className="Text text-sm font-normal leading-tight dark:text-white">
          Don’t have an account?
        </div>
        <div className="Button flex items-center justify-center gap-2">
          <div className="Text text-sm font-semibold leading-tight text-sky-500">
            <NavLink to="/signup">Sign up</NavLink>
          </div>
        </div>
      </div>
    </div>
  );
}
