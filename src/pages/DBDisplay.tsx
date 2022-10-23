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
  const {schemaStore} = useSchemaStore(state=>state);
  const {edges, nodes} = useFlowStore(state=>state);
  const {sidebarDisplayState, welcome} = useSettingsStore(state=>state);
  console.log(sidebarDisplayState);
  //END: STATE DECLARATION

  
  
  //create references for HTML elements
  const mySideBarId:any = useRef();
  const mainId:any = useRef();
  const testBtn:any = useRef();
  const confirmModal:any = useRef();


  /* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */
  const openNav = () => {
    mySideBarId.current.style.width = "400px";
    mainId.current.style.marginRight = "400px";
  }


/* Set the width of the side navigation to 0 and the left margin of the page content to 0, and the background color of body to white */
  const closeNav = () => {
    mySideBarId.current.style.width = "0";
    mainId.current.style.marginRight = "50px"
  }
  
/* Sidebar handler*/
  function handleSidebar(){
    if (sidebarDisplayState) closeNav()
    else openNav();
  }

  /* When the user clicks, open the modal */
  const openModal = () => {
    confirmModal.current.style.display = "block";
  }

  /* When the user clicks 'yes' or 'no', close it */
  const closeModal = () => {
    confirmModal.current.style.display = "none";
  }


  return (
    <div id='DBDisplay'>
      <div ref={mySideBarId} id="mySidenav" className="sidenav">
        <a href="#" className="closebtn" onClick={closeNav}>&times;</a>
        <Sidebar closeNav={closeNav} />
      </div>

      {/* <!-- Use any element to open the sidenav --> */}
      <FeatureTab handleSidebar={handleSidebar} />

      {/* <!-- Add all page content inside this div if you want the side nav to push page content to the right (not used if you only want the sidenav to sit on top of the page --> */}
      <div ref={mainId} id="main">
        {welcome ? 
          <div className="canvas-ConnectToDatabase dark:text-[#f8f4eb] transition-colors duration-500">
            <h3>Welcome to dbSpy!</h3>
            <p>Please connect your database, upload a SQL file, or build your
            database from scratch!
            </p>
          </div>     
          : <Flow />
        }
      </div>
    </div> 
  )
};

export default DBDisplay;