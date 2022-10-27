// React & React Router & React Query Modules;
import React, {useRef} from 'react';

// Components Imported;
import Sidebar from '../components/DBDisplay/Sidebar';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import AddReference from '../components/DBDisplay/AddReference';
import Flow from '../components/ReactFlow/Flow';
import useSettingsStore from '../store/settingsStore';


const DBDisplay = () => {
  const {sidebarDisplayState, welcome, editRefMode} = useSettingsStore(state=>state);
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
        {editRefMode ? <AddReference /> : <></>}
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
    </div> 
  )
};

export default DBDisplay;