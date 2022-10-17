// React & React Router Modules
import React from "react";

//Components imported
import Body from "../components/Home/Body";
import HomeFooter from "../components/Home/HomeFooter";
import HomeLoggedInNavbar from "../components/Home/HomeLoggedInNavbar";
import HomeNavbar from "../components/Home/HomeNavbar";
import Description from '../components/Home/Description';

import Contributors from '../components/Home/Contributors'

interface stateChangeProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  setUser: (user: any) => void;
}

/* "Home" Component - main launch page */
export default function Home() {
  /*
  Three main components under Home:
  1. HomeNavbar - conditional rendering implemented for authorized users (localStorage)
  2. Body - contents describe dbSpy products
  3. HomeFooter
  */
  return (
  //   <div>
  //     {user.id !== null ? (
  //       <HomeLoggedInNavbar user={user} setUser={setUser} />
  //     ) : (
  //       <HomeNavbar />
  //     )}
  //     <Body />
      
  //     <HomeFooter />
  //   </div>
  // );
  <div className="">
    <div className="container mx-auto px-6 md:px-12 xl:px-32">
      <div className="text-center text-gray-800 dark:text-white">
        <div className="block rounded-lg shadow-lg px-6 py-12 md:py-16 md:px-12 dark:bg-slate-900 heroCard">
          <h1 className="text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight mb-12">Database development <br /><span className="text-blue-600">simplified.</span></h1> 
          <br />
          <a className="inline-block px-7 py-3 mb-2 md:mb-0 mr-0 md:mr-2 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out" data-mdb-ripple="true" data-mdb-ripple-color="light" href="#!" role="button">Get started</a>
        </div>
      </div>
    </div>
    <br />
    <section className="container mx-auto px-6 md:px-12 xl:px-32 ">
    <div className="block rounded-lg shadow-lg bg-white dark:text-white dark:bg-slate-900 descriptionCard">
      <div className="flex flex-wrap items-center">
        <div className="grow-0 shrink-0 basis-auto block w-full lg:flex lg:w-6/12 xl:w-4/12">
          <img src="https://user-images.githubusercontent.com/83368864/179806428-f73b2b18-b82b-4b19-8ea1-5af72ddd23d3.gif"
            className="w-11/12 mx-8 my-8 rounded-lg lg:rounded-bl-lg descriptionImg" />
        </div>
        <div className="grow-0 shrink-0 basis-auto w-full lg:w-6/12 xl:w-8/12">
          <div className="px-6 py-12 md:px-12">
            <h2 className="text-3xl font-bold mb-6">Key Features</h2>
            <p className="text-gray-500 mb-6 dark:text-gray-300">
            dbSpy is an open-source tool to facilitate relational database development.<br /> Visualize, modify, and build your database, all in one place.
            </p>

            <div className="grid md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-x-6">
              <div className="mb-6">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Database Connection
                </p>
              </div>

              <div className="mb-6">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Schema Modification
                </p>
              </div>

              <div className="mb-6">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>SQL Query Export
                </p>
              </div>
              <div className="mb-6">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>ER Diagrams
                </p>
              </div>

              <div className="mb-6">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Screenshot Support
                </p>
              </div>

              <div className="mb-6">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2 text-gray-900 dark:text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill="currentColor"
                      d="M173.898 439.404l-166.4-166.4c-9.997-9.997-9.997-26.206 0-36.204l36.203-36.204c9.997-9.998 26.207-9.998 36.204 0L192 312.69 432.095 72.596c9.997-9.997 26.207-9.997 36.204 0l36.203 36.204c9.997 9.997 9.997 26.206 0 36.204l-294.4 294.401c-9.998 9.997-26.207 9.997-36.204-.001z">
                    </path>
                  </svg>Data Logging
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  <Contributors />
  <footer className="bg-gray-200 text-center lg:text-left dark:bg-slate-800">
  <div className="text-gray-700 text-center p-4 dark:text-white">
    Copyright © 2022 dbSpy + OSLabs. Distributed under the MIT License.
  </div>
</footer>
</div>
);
}
