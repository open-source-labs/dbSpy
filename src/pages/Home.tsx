// React & React Router Modules
import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';

//Components imported
import Contributors from '../components/Home/Contributors';
import useCredentialsStore from '../store/credentialsStore';
import screenshot from '../assets/ScreenshotDemo.png';

// const server_url = process.env.NODE_ENV === 'dev' ? process.env.DEV_SERVER_ENDPOINT : process.env.SERVER_ENDPOINT

/* "Home" Component - main launch page */
export default function Home() {
  const user = useCredentialsStore((state: { user: any }) => state.user);
  const setUser = useCredentialsStore((state: { setUser: any }) => state.setUser);
  //END: STATE DECLARATION

  /* Retrieve user data from server*/
  useEffect(() => {
    const getUserData = async () => {

      const response = await axios(`/api/me`, {
        withCredentials: true,
      });
      setUser(response.data);
      return response.data;
    };
    getUserData();
    window.history.replaceState({}, document.title, '/');
  }, []);

  return (
    <div className="">
      <div className="container mx-auto px-6 md:px-12 xl:px-32">
        <div className="text-center text-gray-800 dark:text-[#f8f4eb]">
          <div className="heroCard block rounded-lg bg-[#f8f4eb] px-6 py-12 shadow-lg dark:bg-slate-900 md:py-16 md:px-12">
            <h1 className="mb-12 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
              Database development <br />
              <span className="text-blue-600">simplified.</span>
            </h1>
            <br />
            {user ? (
              <div className="text-3xl font-bold">
                Welcome back, {user.full_name.includes(' ') ? user.full_name.slice(0, user.full_name.indexOf(' ')) : user.full_name}!
              </div>
            ) : (
              <NavLink
                to="/display"
                className="mb-2 mr-0 inline-block rounded bg-blue-600 px-7 py-3 text-sm font-medium uppercase leading-snug text-[#f8f4eb] shadow-md transition duration-150 ease-in-out hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg md:mb-0 md:mr-2"
                data-mdb-ripple="true"
                data-mdb-ripple-color="light"
                role="button"
              >
                Get Started
              </NavLink>
            )}
          </div>
        </div>
      </div>
      <br />
      <section className="container mx-auto px-6 md:px-12 xl:px-32 ">
        <div className="descriptionCard block rounded-lg bg-[#f8f4eb] shadow-lg dark:bg-slate-900 dark:text-[#f8f4eb]">
          <div className="flex flex-wrap items-center">
            <div className="block w-full shrink-0 grow-0 basis-auto lg:flex lg:w-6/12 xl:w-4/12">
              <img
                src={screenshot}
                className="descriptionImg mx-8 my-8 w-11/12 rounded-lg lg:rounded-bl-lg"
              />
            </div>
            <div className="w-full shrink-0 grow-0 basis-auto lg:w-6/12 xl:w-8/12">
              <div className="px-6 py-12 md:px-12">
                <h2 className="mb-6 text-3xl font-bold dark:text-[#f8f4eb]">
                  Key Features
                </h2>
                <p className="mb-6 text-gray-500 dark:text-[#f8f4eb]">
                  dbSpy is an{' '}
                  <a
                    className="text-blue-600"
                    href="https://github.com/open-source-labs/dbSpy"
                  >
                    open-source tool
                  </a>{' '}
                  to facilitate relational database development.
                  <br /> Visualize, modify, and build your various SQL databases, all in one place.
                </p>

                <div className="grid gap-x-6 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
                  <div className="mb-6">
                    <p className="flex items-center text-gray-900 dark:text-[#f8f4eb]">
                      <svg
                        className="mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                        ></path>
                      </svg>
                      Database Connection
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="flex items-center text-gray-900 dark:text-[#f8f4eb]">
                      <svg
                        className="mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                        ></path>
                      </svg>
                      Schema & Data Modification
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="flex items-center text-gray-900 dark:text-[#f8f4eb]">
                      <svg
                        className="mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                        ></path>
                      </svg>
                      SQL Query Export
                    </p>
                  </div>
                  <div className="mb-6">
                    <p className="flex items-center text-gray-900 dark:text-[#f8f4eb]">
                      <svg
                        className="mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                        ></path>
                      </svg>
                      ER Diagrams
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="flex items-center text-gray-900 dark:text-[#f8f4eb]">
                      <svg
                        className="mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                        ></path>
                      </svg>
                      Screenshot Support
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="flex items-center text-gray-900 dark:text-[#f8f4eb]">
                      <svg
                        className="mr-2 h-4 w-4 text-gray-900 dark:text-[#f8f4eb]"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 512 512"
                      >
                        <path
                          fill="currentColor"
                          d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z"
                        ></path>
                      </svg>
                      User Sessions
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* TODO: ADD TEAM GAMJATANG */}
      <Contributors />
      <footer className="bg-gray-200 text-center dark:bg-slate-800 lg:text-left">
        <div className="p-4 text-center text-gray-700 dark:text-[#f8f4eb]">
          Copyright © 2022 dbSpy + OSLabs. Distributed under the MIT License.
        </div>
      </footer>
    </div>
  );
}
