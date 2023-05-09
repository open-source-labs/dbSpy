// React & React Router & React Query Modules;
import React, { useRef,useEffect } from 'react';

// Components Imported;
import Sidebar from '../components/DBDisplay/Sidebar';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import AddReference from '../components/DBDisplay/AddReference';
import Flow from '../components/ReactFlow/Flow';
import DataFlow from '../components/ReactFlow/DataFlow';
import InputModal from '../components/Modals/InputModal';
import DataInputModal from '../components/Modals/DataInputModal';
import useCredentialsStore from '../store/credentialsStore';
import useSettingsStore from '../store/settingsStore';



const DBDisplay: React.FC = () => {

  const { setUser } = useCredentialsStore();

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

  const openAddRowModal = (tableName: string) =>
    setInputModalState(true, 'row', tableName); //(isOpen? mode? currentTable?)

  //create references for HTML elements
  const mySideBarId: any = useRef();
  const mainId: any = useRef();

////////////OAUTHHHHHHHH//////////////////

useEffect(() :void => {


  const windowUrl = window.location.search;
  const urlParams = new URLSearchParams(windowUrl);
  const code = urlParams.get('code');
  const state = urlParams.get('state')


  if(code){

    fetch('/api/oauth',{
       method:'POST',
       headers:{
         'Content-Type': 'Application/JSON'
       },
       body: JSON.stringify({code:code, state:state}),
     })
      .then((data) => {
        if(data.status === 200) console.log(`OAuth : successfully sent authorization code back ${data.status}`);
        else console.log(`OAUTH: error sending authorization code back ${data.status}`);
        return data.json();
      })
      .then((res) => {
        console.log(res);
        setUser(res);

      })
      .catch((err)=> {
        console.log({
          log:`error Post request to backend from DBdisplay ${err}`,
          status:err,
          message: `error occured logging in`})
      })
   }

},[])
//TODO: Hide add table on dataview click
  // const dataOnclick = ():void => {
  //   const addTableButtonRef = useRef(null);
  // }

  //////////////OAUTHHHHHHH//////////////
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

  //console.log('isSchema???', isSchema)
  //console.log('currentTable???', currentTable)

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
            // if true, show schema table
          isSchema? (
            <><button id="showSchema"
              className="bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={setTableMode}
            >Show data</button><Flow /></>
          ) : (
            //if false, show data table
              <><button id="showSchema"
                className="bg-sky-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={setTableMode}
              >Show Schema</button><DataFlow /></>
          )
        )}
      </div>

      {/* MODALS */}

      {/* if isSchema === true => need modal for schema
      if isSchema === false => need modal for data */}

      {inputModalState.isOpen ? (
        isSchema ? (
          <InputModal
            mode={inputModalState.mode}
            tableNameProp={currentTable}
            closeInputModal={() => setInputModalState(false)}
          />
        ) : (
          <DataInputModal
            //mode={inputModalState.mode}
              tableNameProp={currentTable}
            closeInputModal={() => setInputModalState(false)}
          />

        )
      ):null}
    </div>
  );
};

export default DBDisplay;

