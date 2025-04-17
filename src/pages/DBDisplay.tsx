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
import DbNameInput from '../components/Modals/DbNameInput';
import LoadDbModal from '../components/Modals/LoadDbModal';
import DeleteDbModal from '../components/Modals/DeleteDbModal';
import DeleteTableModal from '../components/Modals/DeleteTableModal';
//-- State Stores Imports;
import useCredentialsStore from '../store/credentialsStore';
import useSettingsStore from '../store/settingsStore';

import { useModalStore } from '../store/useModalStore';
import { accountModalStore } from '../store/accountModalStore';
import useSchemaStore from '../store/schemaStore';
import useDataStore from '../store/dataStore';
import axios, { AxiosResponse } from 'axios';

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

  // Zustand state management to handle authentication
  const { user } = useCredentialsStore((state): any => state);
  // dbSpy8.0: Zustand state managemant to handle modals under Account
  const { closeQueryModal, queryModalOpened } = useModalStore();
  const {
    saveDbModalOpened,
    setSaveDbModalClose,
    loadDbModalOpened,
    setLoadDbModalClose,
    nameArr,
    deleteDbModalOpened,
    setDeleteDbModalClose,
  } = accountModalStore();
  const { schemaStore, setSchemaStore } = useSchemaStore((state: any) => state);
  const { dataStore, setDataStore } = useDataStore((state: any) => state);
  // useRef() create a reference to DOM elements
  //create references for HTML elements
  // mySideBarId is the reference to the sidebar
  const mySideBarId: any = useRef();
  // mainId is the reference to the main content
  const mainId: any = useRef();
  // any is not a good type to use, but it is used here to avoid TypeScript errors

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

    // Clean up the URL
    const newURL = window.location.origin + window.location.pathname; // Slightly cleaner way
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

  // for the sidebar of Add table
  /* Set the width of the side navigation to 400px and add a right margin of 400px */
  const openNav = () => {
    // expand the sidebar to 400px
    mySideBarId.current.style.width = '400px';
  };

  /* Set the width of the side navigation to 0, and a right margin of 50px */
  const closeNav = () => {
    // hide the sidebar
    mySideBarId.current.style.width = '0';
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
  // dbSpy8.0: move from FeatureTab to Display page
  // Function for saving databases. Reworked for multiple saves - dbspy 7.0
  const saveSchema = (inputName: string): void => {
    //check to see if a table is present in the schemaStore
    if (Object.keys(schemaStore).length !== 0) {
      //Create request body with the schema to be saved and the inputted name to save it under
      const postBody = {
        schema: JSON.stringify(schemaStore),
        SaveName: inputName,
        TableData: JSON.stringify(dataStore),
      };
      //make a get request to see if the name already exists in the database
      axios
        .get<string[]>('/api/saveFiles/allSave')
        .then((res: AxiosResponse) => {
          const nameArrCheck = [];
          for (let saveName of res.data.data) {
            nameArrCheck.push(saveName.SaveName);
          }
          // if the name already exists then send to one route and if not then send to the other
          // route with combined middleware.
          if (nameArrCheck.includes(inputName)) {
            axios
              .patch('/api/saveFiles/save', postBody)
              .catch((err) => console.error('err', err));
          } else {
            axios
              .post('/api/saveFiles/CreateAndSave', postBody)
              .catch((err) => console.error('err', err));
          }
        })
        .catch((err) => console.error('Err', err));
    } else {
      //if no table is present, send alert to the user
      alert('No schema displayed.');
    }
  };

  const closeSaveDbNameModal = (input?: string) => {
    if (input) {
      saveSchema(input);
    }
    setSaveDbModalClose();
  };

  // Reworked for multiple loads -  dbSpy 7.0
  const loadSchema = async (inputName: string) => {
    try {
      //send the inputName along with the get request as query in the parameters.
      const data = await fetch(`/api/saveFiles/loadSave?SaveName=${inputName}`);
      if (data.status === 204) return alert('No database stored!');
      const schemaString = await data.json();

      setDataStore(JSON.parse(schemaString.tableData));

      return setSchemaStore(JSON.parse(schemaString.data));
    } catch (err) {
      console.error('err retrieve', err);
      window.alert(err);
    }
  };
  // Load selected database - dbSpy 7.0
  const closeLoadDbModal = (input?: string) => {
    if (input) {
      loadSchema(input);
      setDBName(input);
    }
    setLoadDbModalClose();
  };

  // Function for deleting databases - dbspy 7.0
  const deleteDatabase = (inputName: string) => {
    try {
      //send the inputName along with the delete request as query in the parameters.
      axios
        .delete(`/api/saveFiles/deleteSave/${inputName}`)
        .catch((err) => console.error('err', err));
    } catch (err) {
      console.error('err retrieve', err);
      window.alert(err);
    }
  };

  // Delete selected database - dbSpy 7.0
  const closeDeleteDbModal = (input?: string) => {
    if (input) {
      deleteDatabase(input);
    }
    setDeleteDbModalClose();
  };

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

        {/* MODALS */}
        {/* dbSpy8.0: move modals into Display page */}
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
        {saveDbModalOpened ? (
          <DbNameInput closeSaveDbNameModal={closeSaveDbNameModal} />
        ) : null}
        {loadDbModalOpened ? (
          <LoadDbModal nameArr={nameArr} closeLoadDbModal={closeLoadDbModal} />
        ) : null}
        {deleteDbModalOpened ? (
          <DeleteDbModal nameArr={nameArr} closeDeleteDbModal={closeDeleteDbModal} />
        ) : null}
      </div>
    </>
  );
};

export default DBDisplay;
