// React & React Router & React Query Modules;
import React, { useRef, useEffect, useState } from 'react';

// Components Imported;
import Sidebar from '../components/DBDisplay/Sidebar';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import AddReference from '../components/DBDisplay/AddReference';
import Flow from '../components/ReactFlow/Flow';
import QueryGenerator from '../components/Modals/InputModal';
import InputModal from '../components/Modals/InputModal';

import useSettingsStore from '../store/settingsStore';
import useCredentialsStore from '../store/credentialsStore';
import axios from 'axios';

const DBDisplay = () => {
  const { sidebarDisplayState, welcome, editRefMode } = useSettingsStore(
    (state) => state
  );

  // Input Modal state and handlers
  type InputModalState = { isOpen: boolean; mode: 'table' | 'column' };
  const [inputModalState, setInputModalState] = useState<InputModalState>({
    isOpen: false,
    mode: 'table',
  });
  const openAddTableModal = () =>
    setInputModalState((prevState) => ({ isOpen: true, mode: 'table' }));
  const openAddColumnModal = () =>
    setInputModalState((prevState) => ({ isOpen: true, mode: 'column' }));

  //create references for HTML elements
  const mySideBarId: any = useRef();
  const mainId: any = useRef();

  /* Set the width of the side navigation to 250px and add a black background color to body */
  const openNav = () => {
    mySideBarId.current.style.width = '400px';
    mainId.current.style.marginRight = '400px';
  };

  /* Set the width of the side navigation to 0, and the background color of body to white */
  const closeNav = () => {
    mySideBarId.current.style.width = '0';
    mainId.current.style.marginRight = '50px';
  };

  /* Sidebar handler*/
  function handleSidebar() {
    if (sidebarDisplayState) closeNav();
    else openNav();
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
        {editRefMode ? <AddReference /> : <></>}
      </div>

      {/* <!-- Use any element to open the sidenav --> */}
      <FeatureTab handleSidebar={handleSidebar} openAddTableModal={openAddTableModal} />

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
        ) : (
          <Flow openAddColumnModal={openAddColumnModal} />
        )}
      </div>
      {/* MODALS */}
      {inputModalState.isOpen && (
        <InputModal
          mode={inputModalState.mode}
          closeInputModal={() =>
            setInputModalState((prevState) => ({ ...prevState, isOpen: false }))
          }
        />
      )}
    </div>
  );
};

export default DBDisplay;
