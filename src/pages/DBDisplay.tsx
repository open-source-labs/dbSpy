// React & React Router & React Query Modules;
import React, { useRef, useEffect } from 'react';

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
  const openAddRowDataModal = () => setDataInputModalState(true);
  const openAddColumnModal = (tableName: string) =>
    setInputModalState(true, 'column', tableName);

  const openAddRowModal = (tableName: string) =>
    setInputModalState(true, 'row', tableName); //(isOpen? mode? currentTable?)

  //create references for HTML elements
  const mySideBarId: any = useRef();
  const mainId: any = useRef();

  ////////////OAUTHHHHHHHH//////////////////
  useEffect((): void => {
    const windowUrl = window.location.search;
    const urlParams = new URLSearchParams(windowUrl);
    const code = urlParams.get('code');
    const state = urlParams.get('state');

    const newURL = window.location.protocol + '//' + window.location.host + window.location.pathname;
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
          console.log(`OAuth : successfully sent authorization code back ${data.status}`);
          return data.json();
        } else throw new Error('error in backend with oauth');
      })
      .then((res) => {
        console.log('Fetch response from DBDisplay useEffect: ', res);
        setUser(res);
      })
      .catch((err) => {
        console.log({
          log: `error Post request to backend from DBdisplay ${err}`,
          status: err,
          message: `error occured logging in`,
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
    <div
      id="DBDisplay"
      className="bg-[#f8f4eb] transition-colors duration-500 dark:bg-slate-700"
    >
      <div
        ref={mySideBarId}
        id="mySidenav"
        className="sidenav bg-[#fbf3de] shadow-2xl dark:bg-slate-700"
      >
        <a href="#" className="closebtn" onClick={closeNav}>
          &times;
        </a>
        <Sidebar closeNav={closeNav} />

        {/* "AddReference" => change reference in schema */}
        {editRefMode ? <AddReference /> : <></>}
      </div>

      {/* <!-- Use any element to open the sidenav --> */}
      <FeatureTab
        handleSidebar={handleSidebar}
        openAddTableModal={openAddTableModal}
        openDeleteTableModal={openDeleteTableModal}
      />

      {/* <!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page --> */}
      <div ref={mainId} id="main" className="mx-auto transition-colors duration-500">

        {welcome ? (
          <div className="canvas-ConnectToDatabase relative right-[142px] m-auto flex w-[50%] flex-col transition-colors duration-500 dark:text-[#f8f4eb]">
            <h3 className="text-center">Welcome to dbSpy!</h3>
            <p className="text-center">
              Please connect your database, upload a SQL file, or build your database from
              scratch!
            </p>
          </div>
        ) : // If welcome state is false, check isSchema condition
        isSchema ? (
          // If isSchema state is true, render Show Data button and Flow component
          <>
            <button
              id="showSchema"
              className="rounded bg-sky-800 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={setTableMode}
            >
              Show data
            </button>
            <Flow />
          </>
        ) : (
          // If isSchema state is false, render Show Schema button and DataFlow component
          <>
            <button
              id="showSchema"
              className="rounded bg-sky-800 px-4 py-2 font-bold text-white hover:bg-blue-700"
              onClick={setTableMode}
            >
              Show Schema
            </button>
            <DataFlow />
          </>
        )}
      </div>

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
        <DeleteTableModal closeDeleteTableModal={() => setDeleteTableModalState(false)} />
      ) : null}
    </div>
  );
};

export default DBDisplay;
