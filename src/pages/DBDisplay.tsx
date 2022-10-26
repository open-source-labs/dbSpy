// React & React Router & React Query Modules;
import React, {useRef} from 'react';

// Components Imported;
import Sidebar from '../components/DBDisplay/Sidebar';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import Flow from '../components/ReactFlow/Flow';
import useSchemaStore from '../store/schemaStore';
import useFlowStore from '../store/flowStore';
import useSettingsStore from '../store/settingsStore';


const DBDisplay = () => {
  const {schemaStore, reference, setReference} = useSchemaStore(state=>state);
  const {edges, nodes} = useFlowStore(state=>state);
  const {sidebarDisplayState, welcome, editRefMode, setEditRefMode} = useSettingsStore(state=>state);
  //END: STATE DECLARATION

  
  
  //create references for HTML elements
  const mySideBarId:any = useRef();
  const mainId:any = useRef();

  /* Set the width of the side navigation to 250px and add a black background color to body */
  const openNav = () => {
    mySideBarId.current.style.width = "400px";
    mainId.current.style.marginRight = "400px";
  }


/* Set the width of the side navigation to 0, and the background color of body to white */
  const closeNav = () => {
    mySideBarId.current.style.width = "0";
    mainId.current.style.marginRight = "50px"
  }
  
/* Sidebar handler*/
  function handleSidebar(){
    if (sidebarDisplayState) closeNav()
    else openNav();
  }

  return (
    <div id='DBDisplay' className='bg-[#f8f4eb] dark:bg-slate-700 transition-colors duration-500'>
      <div ref={mySideBarId} id="mySidenav" className="sidenav bg-[#fbf3de] dark:bg-slate-700 shadow-2xl">
        <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
        <Sidebar closeNav={closeNav} />
      </div>

      {/* <!-- Use any element to open the sidenav --> */}
      <FeatureTab handleSidebar={handleSidebar} />

      {/* <!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page --> */}
      <div ref={mainId} id="main" className='transition-colors duration-500 mx-auto'>
        {welcome ? 
          <div className="canvas-ConnectToDatabase dark:text-[#f8f4eb] transition-colors duration-500 w-[50%] m-auto flex flex-col relative right-[142px]">
            <h3 className='text-center'>
              Welcome to dbSpy!
            </h3>
            <p className='text-center'>
              Please connect your database, upload a SQL file, or build your
              database from scratch!
            </p>
          </div>     
          :
          <Flow />
        }
      </div>
      {/* MODAL FOR ADD NEW REFERENCES */}
      {!editRefMode ? <></> : (
      <div id="addReferenceModal" className="addReferenceModal">
        {/* <!-- Add Table Modal content --> */}
        <div className="modal-content content-center bg-[#f8f4eb] dark:bg-slate-800 rounded-md border-0 w-[30%] min-w-[300px] max-w-[550px] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:shadow-[0px_5px_10px_#1e293b]">
          <p className="text-center mb-4 text-slate-900 dark:text-[#f8f4eb]">Foreign Key References</p>
          <div className='flex-col justify-between w-[50%] max-w-[400px] mx-auto'>
            <div className='text-center pb-2'>
              <label className='dark:text-[#f8f4eb]'>Primary Key Name: </label>
              <input id='PrimaryKeyNameInput' className='foreignKeyInput w-[100%]' autoComplete='off'/>
            </div>
            <div className='text-center pb-2'>
              <label className='dark:text-[#f8f4eb]'>Reference Key Name: </label>
              <input id='ReferencesPropertyNameInput' className='foreignKeyInput w-[100%]' autoComplete='off'/>
            </div>
            <div className='text-center pb-2'>
              <label className='dark:text-[#f8f4eb]'>Primary Key Table Name: </label>
              <input id='PrimaryKeyTableNameInput' className='foreignKeyInput w-[100%]' autoComplete='off'/>
            </div>
            <div className='text-center pb-2'>
              <label className='dark:text-[#f8f4eb]'>Reference Table Name: </label>
              <input id='ReferencesTableNameInput' className='foreignKeyInput w-[100%]' autoComplete='off'/>
            </div>
              <div className='text-center pb-2'>
              <label className='dark:text-[#f8f4eb]'>Is Destination: </label>
              <input id='IsDestinationInput' className='foreignKeyInput w-[100%]' autoComplete='off'/>
            </div>
            <div className='text-center mb-6'>
              <label className='dark:text-[#f8f4eb]'>Constraint Name: </label>
              <input id='constrainNameInput' className='foreignKeyInput w-[100%]' autoComplete='off'/>
            </div>
          <div className='flex-between text-center'>
            <button 
              onClick={()=> {
                setReference ([{
                  PrimaryKeyName: document.querySelector('#PrimaryKeyNameInput').value,
                  ReferencesPropertyName: document.querySelector('#ReferencesPropertyNameInput').value,
                  PrimaryKeyTableName: document.querySelector('#PrimaryKeyTableNameInput').value,
                  ReferencesTableName: document.querySelector('#ReferencesTableNameInput').value,
                  IsDestination: document.querySelector('#IsDestinationInput').value, 
                  constrainName: document.querySelector('#constrainNameInput').value,
                }]);
                setEditRefMode(false);
              }}
              className="text-slate-900 hover:opacity-70 dark:text-[#f8f4eb] mx-4 modalButton">SAVE</button>
            <button 
              onClick={()=>{
                setEditRefMode(false);
              }} 
              className="text-slate-900 hover:opacity-70 dark:text-[#f8f4eb] mx-4 modalButton">CANCEL</button>
            </div>
          </div> 
        </div>
      </div>
      )}
      {/* END: MODAL FOR ADD NEW REFERENCES */}
    </div> 
  )
};

export default DBDisplay;