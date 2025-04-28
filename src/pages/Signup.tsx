// React & React Router Modules
import axios from 'axios';
import React, { useState } from 'react';
import useCredentialsStore from '../store/credentialsStore';
import { handleOAuthLogin } from '../utils/getGoogleUrl';
import googleImg from '../../src/assets/GoogleImage.png';
import gitHubImage from '../../src/assets/GithubImage.png';
import { NavLink, useNavigate } from 'react-router-dom';

/* "Signup" Component - signup page for user creation */
export default function Signup() {
  const { setUser } = useCredentialsStore();
  const [emailErr, setEmailErr] = useState(false);
  const navigate = useNavigate();

  const LoginUser = async (regInfo: { email: string; password: string }) => {
    const { email, password } = regInfo;
    await axios
      .post(
        '/api/verifyUser',
        { email, password },
        {
          withCredentials: true,
        }
      )
      .then((res) => {
        setUser(res.data);
        navigate('/display');
      })
      .catch((err) => {
        // if somehow there's an error that wasn't caught when registering?
        console.log('Error logging user in after registering.');
      });
  };

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
      .then((res) => {
        const registerData = { email: res.data.email, password: password };
        LoginUser(registerData);
      })
      .catch((err) => {
        const emailInput = document.querySelector('#email') as HTMLElement;
        setEmailErr(true);
        emailInput.focus();
      });
  };

  return (
    <div className="Content mx-auto mt-20 grid h-96 w-96 max-w-screen-md place-items-center gap-8">
      <div className="Header flex h-9 flex-col items-center justify-start gap-6 self-stretch">
        <div className="TextAndSupportingText flex h-9 flex-col items-start justify-start gap-3 self-stretch">
          <div className="Text self-stretch text-center text-3xl font-semibold leading-9 text-white">
            Create an account
          </div>
          <div className="SupportingText self-stretch text-center text-base font-normal leading-normal dark:text-white">
            Welcome! Please register to continue.
          </div>
        </div>
      </div>
      <div className="Content h-70 flex flex-col items-center justify-start gap-6 self-stretch rounded-xl">
        <form
          className="Form h-50 flex flex-col items-start justify-start gap-4 self-stretch"
          onSubmit={(e) => registerAccount(e)}
        >
          <div className="InputField flex h-11 flex-col items-start justify-start self-stretch">
            <div className="InputFieldBase flex h-11 flex-col items-start justify-start gap-1.5 self-stretch">
              <div className="InputWithLabel flex h-11 flex-col items-start justify-start gap-1.5 self-stretch">
                <div className="Input inline-flex items-center justify-start gap-2 self-stretch rounded-lg border border-gray-300 bg-white px-3.5 py-2.5 shadow">
                  <div className="Content flex h-6 shrink grow basis-0 items-center justify-start gap-2">
                    <input
                      placeholder="Enter your full name"
                      className="Text shrink grow basis-0 text-base font-normal leading-normal text-gray-500"
                      name="full_name"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="InputWithLabel flex h-11 flex-col items-start justify-start gap-1.5 self-stretch">
            <div
              className={`Input self-stretch rounded-lg border bg-white px-3.5 py-2.5 shadow ${
                !emailErr ? 'border-gray-300' : 'border-red-500'
              } inline-flex items-center justify-start gap-2`}
            >
              <div className="Content flex h-6 shrink grow basis-0 items-center justify-start gap-2">
                <input
                  placeholder="Enter your email"
                  className="Text shrink grow basis-0 text-base font-normal leading-normal text-gray-500 focus:border-indigo-500"
                  type="email"
                  name="email"
                  required
                />
              </div>
            </div>
          </div>
          <div className="InputWithLabel flex h-11 flex-col items-start justify-start gap-1.5 self-stretch">
            <div
              className={`Input self-stretch rounded-lg border bg-white px-3.5 py-2.5 shadow ${
                !emailErr ? 'border-gray-300' : 'border-red-500'
              } inline-flex items-center justify-start gap-2`}
            >
              <div className="Content flex h-6 shrink grow basis-0 items-center justify-start gap-2">
                <input
                  placeholder="Enter your password"
                  className="Text shrink grow basis-0 text-base font-normal leading-normal text-gray-500"
                  type="password"
                  name="password"
                  required
                />
              </div>
            </div>
          </div>
          <div className="Button inline-flex items-start justify-start self-stretch rounded-lg">
            <button
              className="ButtonBase flex h-11 shrink grow basis-0 items-center justify-center gap-2 rounded-lg border-gray-400 bg-sky-800 px-4 py-2.5 shadow"
              type="submit"
            >
              <div>
                <div className="Text text-base font-semibold leading-normal text-white">
                  Sign Up
                </div>
              </div>
            </button>
          </div>
          {emailErr ? (
            <div className="text-xs text-red-500 md:text-right">
              Error registering. A user account already exists.
            </div>
          ) : null}
        </form>
        <div className="Row inline-flex items-start justify-center gap-1 self-stretch">
          <div className="Text text-sm font-normal leading-tight text-white">
            Already have an account?
          </div>
          <div className="Button flex items-start justify-start">
            <div className="ButtonBase flex items-center justify-center gap-2">
              <div className="Text text-sm font-semibold leading-tight text-sky-500">
                <NavLink to="/login">Login</NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
