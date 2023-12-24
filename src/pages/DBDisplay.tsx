// React & React Router & React Query Modules;
import React, { useRef, useEffect, useState } from 'react';

import { NavLink } from 'react-router-dom';
import logo from '../assets/newLogoWhite.png';
import login from '../assets/right-to-bracket-solid.svg';
import default_pfp from '../assets/default_pfp.svg';

const linkbtn = 'mt-4 inline-block lg:mt-0 text-blue-200 hover:text-white mr-4';
// Components Imported;
import Sidebar from '../components/DBDisplay/Sidebar';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import AddReference from '../components/DBDisplay/AddReference';
import Flow from '../components/ReactFlow/Flow';
import DataFlow from '../components/ReactFlow/DataFlow';
import InputModal from '../components/Modals/InputModal';
import DataInputModal from '../components/Modals/DataInputModal';
import DeleteTableModal from '../components/Modals/DeleteTableModal';
import useCredentialsStore from '../store/credentialsStore';
import useSettingsStore from '../store/settingsStore';

const DBDisplay: React.FC = () => {
  const { setUser } = useCredentialsStore();

  // Zustand state setters/getters from settingsStore
  const {
    sidebarDisplayState,
    setSidebarDisplayState,
    welcome,
    editRefMode,
    inputModalState,
    setInputModalState,
    inputDataModalState,
    setDataInputModalState,
    deleteTableModalState,
    setDeleteTableModalState,
    currentTable,
    isSchema,
    setTableMode,
  } = useSettingsStore((state) => state);

  // Input Modal state and handlers
  type InputModalState = {
    isOpen: boolean;
    mode: 'table' | 'column';
    tableName?: string;
  };

  const openAddTableModal = () => setInputModalState(true, 'table');
  const openDeleteTableModal = () => setDeleteTableModalState(true);

  const { user } = useCredentialsStore((state): any => state);
  //create references for HTML elements
  const mySideBarId: any = useRef();
  const mainId: any = useRef();

  /**
   * Future iterations may want to modify this to not run every time client(s) load
   * dbDisplay when they're not signed in.
   */
  useEffect((): void => {
    // Retrieves the query string from the current URL
    const windowUrl = window.location.search;
    // Parses the query string into a URLSearchParams object
    const urlParams = new URLSearchParams(windowUrl);
    // Gets code/state from URL object to be used by backend for OAuth
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    // Replaces client's URL in window to remove OAuth code/state
    const newURL =
      window.location.protocol + '//' + window.location.host + window.location.pathname;
    window.history.replaceState({}, document.title, newURL);

    fetch('/api/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify({ code: code, state: state }),
    })
      .then((data) => {
        if (data.status >= 200 && data.status < 300) {
          return data.json();
        } else
          throw new Error(`Continue with OAuth failed with status code: ${data.status}`);
      })
      .then((res) => {
        setUser(res);
      })
      .catch((err) => {
        console.log({
          log: `There was an error completing OAuth request: ${err}`,
          status: err,
          message: 'Unable to login with OAuth.',
        });
      });
  }, []);

  //TODO: Hide add table on dataview click
  // const dataOnclick = ():void => {
  //   const addTableButtonRef = useRef(null);
  // }

  /* Set the width of the side navigation to 400px and add a right margin of 400px */
  const openNav = () => {
    mySideBarId.current.style.width = '400px';
    mainId.current.style.marginRight = '400px';
  };

  /* Set the width of the side navigation to 0, and a right margin of 50px */
  const closeNav = () => {
    mySideBarId.current.style.width = '0';
    mainId.current.style.marginRight = '50px';
  };

  // dbSpy 6.0: Update handleSidebar to allow opening/closing sidebar on Connect Database click
  function handleSidebar() {
    if (sidebarDisplayState) {
      setSidebarDisplayState();
      closeNav();
    } else {
      setSidebarDisplayState();
      openNav();
    }
  }

  return (
    <>
      <div className="flex h-2 justify-end pr-5 pt-4">
        {user ? (
          <>
            <span className="text-black-200 mt-4 inline-block dark:text-white lg:mt-0">
              {user.full_name}
            </span>
            <img
              className="ml-2 mr-2 inline-block h-[25] rounded-full dark:invert"
              src={default_pfp}
            />
          </>
        ) : (
          <div className="flex justify-end">
            <NavLink
              to="/login"
              className="p-6 text-base font-bold leading-normal text-black dark:text-white"
            >
              <span>Login</span>
              <img className="ml-3 mr-3 inline-block h-[20] dark:invert" src={login} />
            </NavLink>
          </div>
        )}
      </div>
      <div
        id="DBDisplay"
        className="bg-[#f8f4eb] transition-colors duration-500 dark:bg-gray-900"
      >
        <div
          ref={mySideBarId}
          id="mySidenav"
          className="sidenav bg-[#fbf3de] shadow-2xl dark:bg-gray-900"
        >
          <a href="#" className="closebtn" onClick={closeNav}>
            &times;
          </a>
          <Sidebar closeNav={closeNav} />
          {/* "AddReference" => change reference in schema */}
          {editRefMode ? <AddReference /> : <></>}
        </div>
        {/* <!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page --> */}
        <div ref={mainId} id="main" className="mx-auto transition-colors duration-500">
          {/* <div>"Current Database Name:"</div> */}
          {welcome ? (
            <div className="canvas-ConnectToDatabase relative right-[142px] m-auto flex w-[50%] flex-col transition-colors duration-500 dark:text-[#f8f4eb]">
              <h3 className="text-center">Welcome to dbSpy!</h3>
              <p className="text-center">
                Please connect your database, upload a SQL file, or build your database
                from scratch!
              </p>
            </div>
          ) : // If welcome state is false, check isSchema condition
          isSchema ? (
            // If isSchema state is true, render Show Data button and Flow component
            <>
              <Flow />
              <button
                id="showSchema"
                className="rounded bg-black px-4 py-2 font-bold text-white hover:bg-yellow-600"
                onClick={setTableMode}
              >
                Show data
              </button>
            </>
          ) : (
            // If isSchema state is false, render Show Schema button and DataFlow component
            <>
              <DataFlow />
              <button
                id="showSchema"
                className="rounded bg-sky-800 px-4 py-2 font-bold text-white hover:bg-blue-700"
                onClick={setTableMode}
              >
                Show Schema
              </button>
            </>
          )}
        </div>
        <FeatureTab
          handleSidebar={handleSidebar}
          openAddTableModal={openAddTableModal}
          openDeleteTableModal={openDeleteTableModal}
        />
        {inputModalState.isOpen ? (
          <InputModal
            mode={inputModalState.mode as 'table' | 'column'}
            tableNameProp={currentTable}
            closeInputModal={() => setInputModalState(false)}
          />
        ) : null}
        {inputDataModalState.isOpen ? (
          <DataInputModal
            mode={inputModalState.mode}
            tableNameProp={currentTable}
            closeDataInputModal={() => setDataInputModalState(false)}
          />
        ) : null}
        {deleteTableModalState.isOpen ? (
          <DeleteTableModal
            closeDeleteTableModal={() => setDeleteTableModalState(false)}
          />
        ) : null}
      </div>
    </>
  );
};

export default DBDisplay;
