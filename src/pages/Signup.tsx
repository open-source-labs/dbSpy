// React & React Router Modules
import axios from 'axios';
import React, { useState } from 'react';
import { handleOAuthLogin } from '../utils/getGoogleUrl'
import { NavLink, useNavigate } from 'react-router-dom';

/* "Signup" Component - signup page for user creation */
export default function Signup() {
  const [emailErr, setEmailErr] = useState(false)
  const navigate = useNavigate();
  //Regular login using JWTs without OAuth  
  const registerAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: What's the proper type? HTLMFormElement ? HTMLInputElement?
    let formValues = e.target as any;
    const email = formValues[0].value;
    const full_name = `${formValues[1].value} ${formValues[2].value}`;
    const password = formValues[3].value;
    const userAcc = { full_name, email, password };
    await axios.post('/api/userRegistration', userAcc)
      .then(() => navigate('/login'))
      .catch(err => {
        const emailInput = document.querySelector('#email') as HTMLElement;
        setEmailErr(true);
        emailInput.focus();
      })
  }

  return (
    <div className='mt-10 grid place-items-center dark:text-white'>
      <h1 className="mt-10 text-3xl font-extrabold text-gray-900 dark:text-white md:text-xl lg:text-2xl"><span className="text-transparent bg-clip-text text-sky-700">Sign up</span> with dbSpy</h1>
      <div className='mb-3 text-sm'>
        Already have an account? Login <span className='text-gray-400 font-semibold hover:text-gray-300 active:text-gray-500'><NavLink to='/login'>here</NavLink></span>
      </div>
      <div className=''>
        <form className="w-full max-w-sm" onSubmit={(e) => registerAccount(e)}>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Email
              </label>
            </div>
            <div className="md:w-2/3">
              <input className={"bg-gray-200 appearance-none border-gray-200 border-2 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white " + (!emailErr ? "focus:border-indigo-500" : "focus:border-red-700")} type='email' id='email' name='email' placeholder="example@email.com" required></input>
              {emailErr ? <div className="absolute md:text-right ml-3 text-xs text-red-700">Email address is already in use</div> : null}
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                First Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500" type='text' id='firstName' placeholder='Jane' name='firstName' required></input>
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Last Name
              </label>
            </div>
            <div className="md:w-2/3">
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500" type='text' id='lastName' placeholder='Doe' name='lastName' required></input>
            </div>
          </div>
          <div className="md:flex md:items-center mb-6">
            <div className="md:w-1/3">
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4">
                Password
              </label>
            </div>
            <div className="md:w-2/3">
              <input className="bg-gray-200 appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-indigo-500" type="password" name='password' id='password' placeholder="******************" required></input>
            </div>
          </div>
          <div className="md:flex justify-center">
              <button className="shadow bg-sky-700 hover:bg-indigo-400 focus:shadow-outline focus:outline-none text-white font-bold py-2 px-4 rounded" type="submit">
                Sign Up
              </button>
          </div>
        </form>
        <div className="inline-flex justify-between items-center w-full">
          <hr className="my-8 w-32 h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
          <span className="absolute left-1/2 px-3 font-medium text-gray-900 -translate-x-1/2 dark:text-white dark:bg-slate-700">or</span>
          <hr className="my-8 w-32 h-px bg-gray-200 border-0 dark:bg-gray-700"></hr>
        </div>
      </div>
      <button className='bg-red-600 hover:bg-red-700 text-stone-100 py-1 px-4 inline-flex items-center' onClick={handleOAuthLogin}>
        <svg className="h-4 w-4 mr-2 text-white" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">  <path stroke="none" d="M0 0h24v24H0z" />  <path d="M17.788 5.108A9 9 0 1021 12h-8" /></svg>
        <span>Sign up with Google</span>
      </button>
    </div>
  );
}


