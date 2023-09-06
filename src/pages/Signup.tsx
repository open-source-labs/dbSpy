// React & React Router Modules
import axios from 'axios';
import React, { useState } from 'react';
import { handleOAuthLogin } from '../utils/getGoogleUrl';
import googleImg from '../../src/assets/GoogleImage.png';
import gitHubImage from '../../src/assets/GithubImage.png';
import { NavLink, useNavigate } from 'react-router-dom';

/* "Signup" Component - signup page for user creation */
export default function Signup() {
  const [emailErr, setEmailErr] = useState(false);
  const navigate = useNavigate();
  //Regular login using JWTs without OAuth
  const registerAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: What's the proper type? HTLMFormElement ? HTMLInputElement?
    let formValues = e.target as any;
    const full_name = formValues[0].value;
    const email = formValues[1].value;
    const password = formValues[2].value;
    await axios
      .post('/api/userRegistration', { full_name, email, password })
      .then(() => navigate('/'))
      .catch((err) => {
        const emailInput = document.querySelector('#email') as HTMLElement;
        setEmailErr(true);
        emailInput.focus();
      });
  };

  return (
    <div className="Content mx-auto mt-20 w-96 h-96 grid max-w-screen-md place-items-center gap-8">
    <div className="Header self-stretch h-9 flex-col justify-start items-center gap-6 flex">
      <div className="TextAndSupportingText self-stretch h-9 flex-col justify-start items-start gap-3 flex">
        <div className="Text self-stretch text-center text-white text-3xl font-semibold leading-9">Create an account</div>
      </div>
    </div>
    <div className="Content self-stretch h-70 rounded-xl flex-col justify-start items-center gap-6 flex">
      <form className="Form self-stretch h-50 flex-col justify-start items-start gap-4 flex"
      onSubmit={(e) => registerAccount(e)}
      >
        <div className="InputField self-stretch h-11 flex-col justify-start items-start flex">
          <div className="InputFieldBase self-stretch h-11 flex-col justify-start items-start gap-1.5 flex">
            <div className="InputWithLabel self-stretch h-11 flex-col justify-start items-start gap-1.5 flex">
              <div className="Input self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow border border-gray-300 justify-start items-center gap-2 inline-flex">
                <div className="Content grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
                  <input 
                  placeholder="Enter your full name"
                  className="Text grow shrink basis-0 text-gray-500 text-base font-normal leading-normal"
                  name="full_name"
                  required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="InputWithLabel self-stretch h-11 flex-col justify-start items-start gap-1.5 flex">
          <div className={`Input self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow border ${!emailErr ? 'border-gray-300' : 'border-red-500'} justify-start items-center gap-2 inline-flex`}>
            <div className="Content grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
              <input 
              placeholder="Enter your email"
              className="Text grow shrink basis-0 focus:border-indigo-500 text-gray-500 text-base font-normal leading-normal"
              type="email"
              name="email"
              required
              />
            </div>
          </div>
        </div>
        <div className="InputWithLabel self-stretch h-11 flex-col justify-start items-start gap-1.5 flex">
          <div className={`Input self-stretch px-3.5 py-2.5 bg-white rounded-lg shadow border ${!emailErr ? 'border-gray-300' : 'border-red-500'} justify-start items-center gap-2 inline-flex`}>
            <div className="Content grow shrink basis-0 h-6 justify-start items-center gap-2 flex">
              <input 
              placeholder="Enter your password"
              className="Text grow shrink basis-0 text-gray-500 text-base font-normal leading-normal"
              type="password"
              name="password"
              required
              />
            </div>
          </div>
        </div>
        <div className="Button self-stretch rounded-lg justify-start items-start inline-flex">
          <button className="ButtonBase grow shrink basis-0 h-11 px-4 py-2.5 bg-sky-800 rounded-lg shadow border border-gray-400 justify-center items-center gap-2 flex" type="submit">
              <div >
            <div className="Text text-white text-base font-semibold leading-normal">
              Sign Up
            </div>
              </div>
          </button>
        </div>
        {emailErr ? (
                <div className="text-xs text-red-500 md:text-right">
                  Error signing up, please check email/password and try again.
                </div>
              ) : null}
      </form>
    <div className="Row self-stretch justify-center items-start gap-1 inline-flex">
      <div className="Text text-white text-sm font-normal leading-tight">Already have an account?</div>
      <div className="Button justify-start items-start flex">
        <div className="ButtonBase justify-center items-center gap-2 flex">
          <div className="Text text-sky-500 text-sm font-semibold leading-tight">
          <NavLink to="/login">Login</NavLink>
            </div>
        </div>
      </div>
    </div>
    </div>
  </div>
  );
}
