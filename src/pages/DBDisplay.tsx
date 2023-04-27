// React & React Router & React Query Modules;
import React, { useRef } from 'react';

// Components Imported;
import Sidebar from '../components/DBDisplay/Sidebar';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import AddReference from '../components/DBDisplay/AddReference';
import Flow from '../components/ReactFlow/Flow';
import DataFlow from '../components/ReactFlow/DataFlow';
import InputModal from '../components/Modals/InputModal';

import useSettingsStore from '../store/settingsStore';

const DBDisplay: React.FC = () => {
  const {
    sidebarDisplayState,
    welcome,
    editRefMode,
    inputModalState,
    setInputModalState,
    currentTable,
    isSchema,
    setTableMode
  } = useSettingsStore((state) => state);

  // Input Modal state and handlers
  type InputModalState = {
    isOpen: boolean;
    mode: 'table' | 'column';
    tableName?: string;
  };
  const openAddTableModal = () => setInputModalState(true, 'table');
  const openAddColumnModal = (tableName: string) =>
    setInputModalState(true, 'column', tableName);

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

        {/* <button id="showData"
          className="bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={setTableMode}
        >Data</button> */}
        
        {welcome ? (
          <div className="canvas-ConnectToDatabase relative right-[142px] m-auto flex w-[50%] flex-col transition-colors duration-500 dark:text-[#f8f4eb]">
            <h3 className="text-center">Welcome to dbSpy!</h3>
            <p className="text-center">
              Please connect your database, upload a SQL file, or build your database from
              scratch!
            </p>
          </div>
        ) : (
           isSchema? ( // if state for isSchema  === true
              <><button id="showSchema"
                className="bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={setTableMode}
              >Show data</button><Flow /></>
           ) : (
            //if false, we need data table
              <><button id="showSchema"
                className="bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={setTableMode}
              >Show Schema</button><DataFlow /></>
                // <p>Data table</p>
        )
        )}
      </div>
      {/* MODALS */}
      {inputModalState.isOpen && (
        <InputModal
          mode={inputModalState.mode}
          tableNameProp={currentTable}
          closeInputModal={() => setInputModalState(false)}
        />
      )}
    </div>
  );
};

export default DBDisplay;

