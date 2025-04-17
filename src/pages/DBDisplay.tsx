//* main dashboard page
// React & React Router & React Query Modules;
import React, { useRef, useEffect, useState } from 'react';

// Dashboard Components Imported;
import Sidebar from '../components/DBDisplay/Sidebar';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import AddReference from '../components/DBDisplay/AddReference';
import Flow from '../components/ReactFlow/Flow';
import DataFlow from '../components/ReactFlow/DataFlow';
//-- Modals (pop ups) Components Imports;
import InputModal from '../components/Modals/InputModal';
import DataInputModal from '../components/Modals/DataInputModal';
import LoadDbModal from '@/components/Modals/LoadDbModal';
import DeleteTableModal from '../components/Modals/DeleteTableModal';
//-- State Stores Imports;
import useCredentialsStore from '../store/credentialsStore';
import useSettingsStore from '../store/settingsStore';

import { useModalStore } from '../store/useModalStore';
import QueryModal from '../components/Modals/QueryModal';

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
    dbName,
    setDBName,
  } = useSettingsStore((state) => state);

  // Input Modal state and handlers
  type InputModalState = {
    isOpen: boolean;
    mode: 'table' | 'column';
    tableName?: string;
  };
  //-- helper functions to open specific modals
  const openAddTableModal = () => setInputModalState(true, 'table');
  const openDeleteTableModal = () => setDeleteTableModalState(true);

  const { openQueryModal, closeQueryModal, queryModalOpened } = useModalStore();
  // Zustand state management to handle authentication
  const { user } = useCredentialsStore((state): any => state);
  // useRef() create a reference to DOM elements
  //create references for HTML elements
  // mySideBarId is the reference to the sidebar
  const mySideBarId: any = useRef();
  // mainId is the reference to the main content
  const mainId: any = useRef();
  // any is not a good type to use, but it is used here to avoid TypeScript errors
  // const mySideBarId = useRef<HTMLDivElement | null>(null);
  // const mainId = useRef<HTMLDivElement | null>(null);

  /**
   * Future iterations may want to modify this to not run every time client(s) load
   * dbDisplay when they're not signed in.
   */
  //-- OAuth Login Handler
  useEffect((): void => {
    // Retrieves the query string from the current URL
    const windowUrl = window.location.search;
    // Parses the query string into a URLSearchParams object
    const urlParams = new URLSearchParams(windowUrl);
    // Gets code/state from URL object to be used by backend for OAuth
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    // Only proceed if there's a code present (meaning it's the initial OAuth redirect)
    //if (code && state) {
    // Replaces client's URL in window to remove OAuth code/state
    const newURL = window.location.origin + window.location.pathname;
    window.history.replaceState({}, document.title, newURL);

    // send POST request to /api/oauth with code/state
    fetch('/api/oauth', {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/JSON',
      },
      body: JSON.stringify({ code: code, state: state }),
    })
      .then((data) => {
        // successful codes
        if (data.status >= 200 && data.status < 300) {
          // convert response to JSON
          return data.json();
        } else
          throw new Error(`Continue with OAuth failed with status code: ${data.status}`);
      })
      .then((res) => {
        // update the state with user data
        setUser(res);
      })
      .catch((err) => {
        console.log({
          log: `There was an error completing OAuth request: ${err}`,
          status: err,
          message: 'Unable to login with OAuth.',
        });
      });
    // }
  }, []);

  //TODO: Hide add table on dataview click
  // const dataOnclick = ():void => {
  //   const addTableButtonRef = useRef(null);
  // }

  // for the sidebar of Add table
  /* Set the width of the side navigation to 400px and add a right margin of 400px */
  const openNav = () => {
    // expand the sidebar to 400px
    mySideBarId.current.style.width = '400px';
    // move the content to the left
    // mainId.current.style.marginRight = '400px';
  };

  /* Set the width of the side navigation to 0, and a right margin of 50px */
  const closeNav = () => {
    // hide the sidebar
    mySideBarId.current.style.width = '0';
    // move the content to the right
    // mainId.current.style.marginRight = '0';
  };

  // dbSpy 6.0: Update handleSidebar to allow opening/closing sidebar on Connect Database click
  // the sidebar for database information will be opened after clicking the Connect Database button
  // click it again or click close button to close the sidebar
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
      <div id="DBDisplay" className=" transition-colors duration-500">
        {/* shadow-2xl: strong box-shadow for depth, bg-gray-900: change background color */}
        <div
          ref={mySideBarId}
          id="mySidenav"
          className="sidenav bg-opacity-10 bg-gradient-to-b from-transparent to-transparent"
        >
          <a
            href="#"
            className="absolute right-4 top-24 z-50 text-[40px] text-black hover:text-yellow-500 dark:text-white"
            onClick={closeNav}
          >
            &times;
          </a>
          <Sidebar closeNav={closeNav} />
          {/* "AddReference" => change reference in schema */}
          {editRefMode ? <AddReference /> : <></>}
        </div>
        {/* <!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page --> */}
        {/* mx-auto: center the div horizontally, transition-colors: enable smooth color transitions, duration-500: set transition duration to 0.5s */}
        <div ref={mainId} id="main" className="mx-auto transition-colors duration-500">
          {/* <div>"Current Database Name:"</div> */}
          {/* relative: positions relative to its normal location, right-[142px]: move 142px to left */}
          {/* m-auto = margin: auto in CSS */}
          {/* w-50%: set width to 50% of parent, flex-col: stack children vertically */}
          {welcome ? (
            <div className="pt-20">
              <div className="canvas-ConnectToDatabase relative right-[142px] m-auto flex w-[50%] flex-col text-black transition-colors duration-500 dark:text-[#f8f4eb]">
                <h3 className="text-center">Welcome to dbSpy!</h3>
                <p className="text-center">
                  Please connect your database, upload a SQL file, or build your database
                  from scratch!
                </p>
              </div>
            </div>
          ) : // If welcome state is false, check isSchema condition
          isSchema ? (
            // If isSchema state is true, render Show Data button and Flow component
            <>
              <Flow />
              {/* rounded: rounded corner, px: padding horizontal, py: padding vertical */}
              <button
                id="showSchema"
                className="mt-2 h-[28px] rounded bg-[#7597c5] px-4 font-bold text-white hover:bg-yellow-500 hover:text-black dark:bg-accent dark:hover:bg-yellow-500 "
                onClick={setTableMode}
              >
                Show data
              </button>
              {/* ml: add margin to the left*/}
              <span id="text" className="ml-5 text-black dark:text-white">
                Current Database: {dbName}
              </span>
            </>
          ) : (
            // If isSchema state is false, render Show Schema button and DataFlow component
            <>
              <DataFlow />
              <button
                id="showSchema"
                className="mt-2 h-[28px] rounded bg-[#7597c5] px-4 font-bold text-white hover:bg-yellow-500 hover:text-black dark:bg-accent dark:hover:bg-yellow-500 "
                onClick={setTableMode}
              >
                Show Schema
              </button>
              <span id="text" className="ml-5 text-black dark:text-white">
                Current Database: {dbName}
              </span>
            </>
          )}
        </div>
        <FeatureTab
          handleSidebar={handleSidebar}
          openAddTableModal={openAddTableModal}
          openDeleteTableModal={openDeleteTableModal}
        />
        {queryModalOpened ? <QueryModal closeQueryModal={closeQueryModal} /> : null}
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
