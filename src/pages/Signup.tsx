// React & React Router Modules
import axios from 'axios';
import React, { useState } from 'react';
import { handleOAuthLogin } from '../utils/getGoogleUrl';
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
    const email = formValues[0].value;
    const full_name = `${formValues[1].value} ${formValues[2].value}`;
    const password = formValues[3].value;
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
    <div className="mt-10 grid place-items-center dark:text-white">
      <h1 className="mt-10 text-3xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-2xl">
        Sign up with dbSpy
      </h1>
      <div className="mb-3 text-sm">
        Already have an account? Login{' '}
        <span className="font-semibold text-gray-400 hover:text-gray-300 active:text-gray-500">
          <NavLink to="/login">here</NavLink>
        </span>
      </div>
      <div className="">
        <form className="w-full max-w-sm" onSubmit={(e) => registerAccount(e)}>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                Email
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className={
                  'w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:bg-white focus:outline-none ' +
                  (!emailErr ? 'focus:border-indigo-500' : 'focus:border-red-700')
                }
                type="email"
                id="email"
                name="email"
                placeholder="example@email.com"
                required
              ></input>
              {emailErr ? (
                <div className="absolute ml-3 text-xs text-red-700 md:text-right">
                  Email address is already in use
                </div>
              ) : null}
            </div>
          </div>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                First Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none"
                type="text"
                id="firstName"
                placeholder="Jane"
                name="firstName"
                required
              ></input>
            </div>
          </div>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                Last Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none"
                type="text"
                id="lastName"
                placeholder="Doe"
                name="lastName"
                required
              ></input>
            </div>
          </div>
          <div className="mb-6 md:flex md:items-center">
            <div className="md:w-1/3">
              <label className="mb-1 block pr-4 font-bold text-gray-500 md:mb-0 md:text-right">
                Password
              </label>
            </div>
            <div className="md:w-2/3">
              <input
                className="w-full appearance-none rounded border-2 border-gray-200 bg-gray-200 px-4 py-2 leading-tight text-gray-700 focus:border-indigo-500 focus:bg-white focus:outline-none"
                type="password"
                name="password"
                id="password"
                placeholder="******************"
                required
              ></input>
            </div>
          </div>
          <div className="justify-center md:flex">
            <button
              className="focus:shadow-outline rounded bg-sky-700 px-4 py-2 font-bold text-white shadow hover:bg-indigo-400 focus:outline-none"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        {/* TODO: Implement production scale OAuth */}
        {/* <div className="inline-flex w-full items-center justify-between">
          <hr className="my-8 h-px w-32 border-0 bg-gray-200 dark:bg-gray-700"></hr>
          <span className="absolute left-1/2 -translate-x-1/2 px-3 font-medium text-gray-900 dark:bg-slate-700 dark:text-white">
            or
          </span>
          <hr className="my-8 h-px w-32 border-0 bg-gray-200 dark:bg-gray-700"></hr>
        </div> */}
      </div>
      {/* <button
        className="inline-flex items-center bg-red-600 py-1 px-4 text-stone-100 hover:bg-red-700"
        onClick={handleOAuthLogin}
      >
        <svg
          className="mr-2 h-4 w-4 text-white"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {' '}
          <path stroke="none" d="M0 0h24v24H0z" />{' '}
          <path d="M17.788 5.108A9 9 0 1021 12h-8" />
        </svg>
        <span>Sign up with Google</span>
      </button> */}
    </div>
  );
}
