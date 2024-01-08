// React & React Router & React Query Modules
import React, { useState, useRef, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import { NavLink } from 'react-router-dom';

const linkbtn = 'mt-4 inline-block lg:mt-0 text-blue-200 hover:text-white mr-4';

// Functions imported:
import parseSql from '../../parse';
// Images for logo animation db 7.0
import logo from '../../assets/newLogoWhite.png';
import logo1 from '../../assets/newLogoWhite_color1.png';
import logo2 from '../../assets/newLogoWhite_color2.png';
import logo3 from '../../assets/newLogoWhite_color3.png';
import logo4 from '../../assets/newLogoWhite_color4.png';
import logo5 from '../../assets/newLogoWhite_color5.png';
import logo6 from '../../assets/newLogoWhite_color6.png';
import logo7 from '../../assets/newLogoWhite_color7.png';
import logo8 from '../../assets/newLogoWhite_color8.png';
import logo9 from '../../assets/newLogoWhite_color9.png';
import logo10 from '../../assets/newLogoWhite_color10.png';
import logo11 from '../../assets/newLogoWhite_color11.png';
import logo12 from '../../assets/newLogoWhite_color12.png';
import darkLogo from '../../assets/newLogoBlack.png';
import darkLogo1 from '../../assets/newLogoBlack_color1.png';
import darkLogo2 from '../../assets/newLogoBlack_color2.png';
import darkLogo3 from '../../assets/newLogoBlack_color3.png';
import darkLogo4 from '../../assets/newLogoBlack_color4.png';
import darkLogo5 from '../../assets/newLogoBlack_color5.png';
import darkLogo6 from '../../assets/newLogoBlack_color6.png';
import darkLogo7 from '../../assets/newLogoBlack_color7.png';
import darkLogo8 from '../../assets/newLogoBlack_color8.png';
import darkLogo9 from '../../assets/newLogoBlack_color9.png';
import darkLogo10 from '../../assets/newLogoBlack_color10.png';
import darkLogo11 from '../../assets/newLogoBlack_color11.png';
import darkLogo12 from '../../assets/newLogoBlack_color12.png';

// Stores imported:
import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';
import useSettingsStore from '../../store/settingsStore';
import useCredentialsStore from '../../store/credentialsStore';
//import icon
import {
  Home,
  ConnectDatabase,
  UploadSQLFile,
  ExportQuery,
  AddTable,
  DeleteTable,
  ClearCanvas,
  Undo,
  Redo,
  SaveDatabase,
  LoadDatabase,
  SignOut,
  BuildDatabase,
} from '../../FeatureTabIcon';
// Components imported:
import QueryModal from '../Modals/QueryModal';
import DbNameInput from '../Modals/DbNameInput';
import LoadDbModal from '../Modals/LoadDbModal';

/** "FeatureTab" Component - a tab positioned in the left of the page to access features of the app; */
export default function FeatureTab(props: any) {
  //STATE DECLARATION (dbSpy3.0)
  const { setEdges, setNodes } = useFlowStore((state) => state);
  const [theme, setTheme] = useState('Light');

  const { schemaStore, setSchemaStore, undoHandler, redoHandler } = useSchemaStore(
    (state) => state
  );
  const { user, setUser } = useCredentialsStore((state: any) => state);

  const { setWelcome, isSchema, setDarkMode } = useSettingsStore((state) => state);
  const [action, setAction] = useState(new Array());
  const [queryModalOpened, setQueryModalOpened] = useState(false);
  const [saveDbNameModalOpened, setSaveDbNameModalOpened] = useState(false);
  const [loadDbModalOpened, setLoadDbModalOpened] = useState(false);
  const [nameArr, setNameArr] = useState<string[]>([]);
  //END: STATE DECLARATION

  //create references for HTML elements
  const confirmModal: any = useRef();
  /* When the user clicks, open the modal */
  const openModal: any = (callback: any) => {
    confirmModal.current.style.display = 'block';
    confirmModal.current.style.zIndex = '100';
    setAction([callback]);
  };
  /* When the user clicks 'yes' or 'no', close it */
  const closeModal: any = (response: boolean) => {
    confirmModal.current.style.display = 'none';
    if (response) action[0]();
  };

  // HELPER FUNCTIONS

  const connectDb = () => {
    //if Flow is rendered, openModal
    if (document.querySelector('.flow')) openModal(props.handleSidebar);
    else props.handleSidebar();
  };
  const uploadSQL = () => {
    //if Flow is rendered, openModal
    if (document.querySelector('.flow')) openModal(getSchemaFromFile);
    else getSchemaFromFile();
  };

  const buildDb = () => {
    //if Flow is rendered, open modal
    if (document.querySelector('.flow')) openModal(buildDatabase);
    else buildDatabase();
  };

  const clearCanvas = () => {
    //if Flow is rendered, open modal
    if (document.querySelector('.flow')) openModal(clearCanvasTables);
    else clearCanvasTables();
  };

  const getSchemaFromFile = () => {
    // creating an input element for user to upload sql file
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();
    input.onchange = (e: any): void => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        //Parse the .sql file into a data structure that is same as "fetchedData" and store it into a variable named "parsedData"
        const parsedData: any = parseSql(event.target.result);
        setSchemaStore(parsedData);
        setWelcome(false);
      };
    };
  };

  const buildDatabase = () => {
    setNodes([]);
    setEdges([]);
    setWelcome(false);
  };

  const clearCanvasTables = () => {
    setSchemaStore({});
    setEdges([]);
    setNodes([]);
    setWelcome(false);
  };

  // Export QueryModal
  const openQueryModal = () => {
    setQueryModalOpened(true);
  };
  const closeQueryModal = () => {
    setQueryModalOpened(false);
  };

  //SaveDbNameModal
  const openSaveDbNameModal = () => {
    if (!user) alert('Must sign in to save!');
    else {
      setSaveDbNameModalOpened(true);
    }
  };

  const closeSaveDbNameModal = (input?: string) => {
    //pull dbName from input field and send it to the database along with the schema.
    if (input) {
      saveSchema(input);
    }
    setSaveDbNameModalOpened(false);
  };

  // LoadDbModal
  // Open loadDbName Modal and send get request to database to get&list all the databases name.
  const openLoadDbModal = async (): Promise<string[]> => {
    buildDatabase();
    if (!user) {
      alert('Must sign in to save!');
      return Promise.reject('User not signed in');
    } else {
      const response = await axios
        .get<string[]>('/api/saveFiles/allSave')
        .then((res: AxiosResponse) => {
          const nameArr = [];
          for (let saveName of res.data.data) {
            nameArr.push(saveName.SaveName);
          }
          setLoadDbModalOpened(true);
          setNameArr(nameArr);
        })
        .catch((err) => {
          console.error('Err', err);
          return Promise.reject(err);
        });
    }
    return [];
  };

  const closeLoadDbModal = (input?: string) => {
    if (input) {
      loadSchema(input);
    }
    setLoadDbModalOpened(false);
  };

  // Function for saving databases. Reworked for multiple saves - db 7.0
  const saveSchema = (inputName: string): void => {
    //check to see if a table is present in the schemaStore
    if (Object.keys(schemaStore).length !== 0) {
      //Create request body with the schema to be saved and the inputted name to save it under
      const postBody = {
        schema: JSON.stringify(schemaStore),
        SaveName: inputName,
      };
      //make a get request to see if the name already exists in the database
      axios
        .get<string[]>('/api/saveFiles/allSave')
        .then((res: AxiosResponse) => {
          const nameArr = [];
          for (let saveName of res.data.data) {
            nameArr.push(saveName.SaveName);
          }
          // if the name already exists then send to one route and if not then send to the other
          // route with combined middleware.
          if (nameArr.includes(inputName)) {
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

  // Reworked for multiple loads -  db 7.0
  const loadSchema = async (inputName: string) => {
    try {
      //send the inputName along with the get request as query in the parameters.
      const data = await fetch(`/api/saveFiles/loadSave?SaveName=${inputName}`);
      if (data.status === 204) return alert('No database stored!');
      const schemaString = await data.json();
      console.log('schemaString212', schemaString.data);
      return setSchemaStore(JSON.parse(schemaString.data));
    } catch (err) {
      console.log(err);
      console.error('err retrieve', err);
      window.alert(err);
    }
  };

  // Clears session + reset store
  const signoutSession = async () => {
    await fetch(`/api/logout`);
    window.open('/', '_self');
    setSchemaStore({});
    setUser(null);
  };

  //Toggle function for DarkMode
  const toggleClass = (): void => {
    const page = document.getElementById('body');
    page!.classList.toggle('dark');
    theme === 'Dark' ? setTheme('Light') : setTheme('Dark');
    setDarkMode();
  };

  //Create logo image hover over animation - db 7.0
  let ImgSwap;
  function logoImageFlow(event) {
    //let currentLogoImg = event.target.src;
    let logoImgArr;
    if (theme === 'Light') {
      logoImgArr = [
        logo1,
        logo2,
        logo3,
        logo4,
        logo5,
        logo6,
        logo7,
        logo8,
        logo9,
        logo10,
        logo11,
        logo12,
        logo12,
        logo,
      ];
    } else {
      logoImgArr = [
        darkLogo1,
        darkLogo2,
        darkLogo3,
        darkLogo4,
        darkLogo5,
        darkLogo6,
        darkLogo7,
        darkLogo8,
        darkLogo9,
        darkLogo10,
        darkLogo11,
        darkLogo12,
        darkLogo12,
        darkLogo,
      ];
    }
    let currIndex = 0;
    ImgSwap = setInterval(function () {
      if (currIndex > 12) {
        currIndex = 0;
      }
      event.target.src = logoImgArr[currIndex];
      currIndex++;
    }, 130); // Adjust the timeout value (in milliseconds) as needed
  }
  // function to clean up after the hover over affect - db 7.0
  function clearImgSwap(event: any) {
    if (theme === 'Light') {
      event.target.src = logo;
    } else {
      event.target.src = darkLogo;
    }
    clearInterval(ImgSwap);
  }

  //on click function for revealing/hiding the nav bar db - 7.0
  let logoClicked = false;
  function revealHideNav(event: any) {
    // Get the siblings
    logoClicked = !logoClicked;
    let time = 30;
    if (logoClicked) {
      event.target.parentElement.classList.add('pointer-events-none');
      event.target.parentElement.parentElement.classList.add('pointer-events-none');
    }
    if (!logoClicked) {
      event.target.parentElement.classList.remove('pointer-events-none');
      event.target.parentElement.parentElement.classList.remove('pointer-events-none');
    }
    event.target;
    const siblings = Array.from(event.target.parentElement.children).filter(
      (child) => child !== event.target
    );
    // if (logoClicked) {
    //   event.target.parentElement.remove('');
    // }
    for (let element of siblings) {
      if (logoClicked) {
        setTimeout(() => element.classList.add('hidden'), time);
        time += 30;
      } else {
        setTimeout(() => element.classList.remove('hidden'), time);
        time += 30;
      }
    }
  }

  // END: HELPER FUNCTIONS

  return (
    <>
      {/* PAGE */}
      <div className="mx-auto max-w-2xl">
        <aside
          className="featureTab z-index-10 light:bg-sky-800 absolute inset-y-0 left-0 top-24 w-64"
          aria-label="FeatureTab"
        >
          <div className="menuBar light:bg-sky-800 ml-3 overflow-auto rounded px-10 py-6 transition-colors duration-500">
            {theme === 'Light' ? (
              <img
                className="pointer-events-auto mb-1 mt-14 inline-block h-[88px] w-[200px] fill-current pr-3 filter"
                src={logo}
                alt="Logo"
                onMouseOver={logoImageFlow} //db 7.0
                onMouseOut={clearImgSwap} //db 7.0
                onClick={revealHideNav} //db 7.0
              />
            ) : (
              <img
                className="pointer-events-auto mb-1 mt-14 inline-block h-[45] h-[88px] w-[200px] pr-3 filter"
                src={darkLogo}
                alt="Logo"
                onMouseOver={logoImageFlow}
                onMouseOut={clearImgSwap}
                onClick={revealHideNav}
              />
            )}

            <NavLink to="/" className={linkbtn}>
              <div className="inline-flex h-10 w-[232px] items-center justify-start gap-3 rounded-lg py-2 pl-1 pr-[54.52px]">
                {/* width="28" height="28" viewBox="0 0 35 28" fill="none"   */}
                <Home />
                <div className="inline-flex flex-col items-start justify-start pr-[2.48px]">
                  <span className="text-sm text-slate-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300">
                    Home
                  </span>
                </div>
              </div>
            </NavLink>

            <button onClick={toggleClass}>
              <div className="ItemLink inline-flex h-10 w-[232px] items-center justify-start gap-0 rounded-lg py-2 pl-0 pr-0">
                <svg
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.0"
                  stroke="currentColor"
                  className=" ml-2 mr-2 h-[24] stroke-current text-gray-500 hover:text-yellow-500 dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.50488 10.7569C1.50488 16.4855 6.14803 21.1294 11.8756 21.1294C16.2396 21.1294 19.974 18.4335 21.5049 14.616C20.3104 15.0962 19.0033 15.3668 17.6372 15.3668C11.9095 15.3668 7.26642 10.7229 7.26642 4.99427C7.26642 3.63427 7.53299 2.3195 8.00876 1.12939C4.19637 2.66259 1.50488 6.39536 1.50488 10.7569Z"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span className="DarkMode text-sm font-normal leading-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300 ">
                  {theme} Mode
                </span>
              </div>
            </button>

            <p className=" mt-4 text-slate-900 dark:text-[#f8f4eb]">Action</p>
            <hr />
            <ul className=" space-y-0">
              <li>
                <a
                  onClick={connectDb}
                  className="dark: flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  data-testid="connect-database"
                >
                  <ConnectDatabase />
                  <span className="ml-3">Connect Database</span>
                </a>
              </li>
              <li>
                <a
                  onClick={uploadSQL}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <UploadSQLFile />
                  <span className="ml-3 flex-1 whitespace-nowrap">Upload SQL File</span>
                  <span className="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"></span>
                </a>
              </li>
              <li>
                <a
                  onClick={buildDb}
                  className=" flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <BuildDatabase />
                  <span className="ml-3 flex-1 whitespace-nowrap">Build Database</span>
                </a>
              </li>
              {/* TODO: Add SAVE feature */}
              <li>
                <a
                  onClick={openQueryModal}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline  dark:text-[#f8f4eb] dark:hover:text-yellow-300 "
                >
                  <ExportQuery />
                  <span className="ml-3 flex-1 whitespace-nowrap">Export Query</span>
                </a>
              </li>
              <br />
              <p className="text-slate-900 dark:text-[#f8f4eb]">Edit</p>
              <hr />
              {isSchema ? (
                <li>
                  <a
                    onClick={() => {
                      props.openAddTableModal();
                      // if schemaStore is empty, initialize
                      if (!Object.keys(schemaStore).length) buildDatabase();
                    }}
                    id="addTable"
                    className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300 "
                  >
                    <AddTable />
                    <span className="ml-3 flex-1 whitespace-nowrap">Add Table</span>
                  </a>
                </li>
              ) : null}
              {Object.keys(schemaStore).length ? (
                <li>
                  <a
                    onClick={() => {
                      props.openDeleteTableModal();
                    }}
                    id="deleteTable"
                    className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  >
                    <DeleteTable />
                    <span className="ml-3 flex-1 whitespace-nowrap">Delete Table</span>
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  onClick={clearCanvas}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900  hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <ClearCanvas />
                  <span className="ml-3 flex-1 whitespace-nowrap">Clear Canvas</span>
                </a>
              </li>
              {/* TODO: Add UNDO & REDO feature */}
              <li>
                <a
                  onClick={undoHandler}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <Undo />
                  <span className="ml-3 flex-1 whitespace-nowrap">Undo</span>
                </a>
              </li>
              <li>
                <a
                  onClick={redoHandler}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <Redo />
                  <span className="ml-3 flex-1 whitespace-nowrap">Redo</span>
                </a>
              </li>
            </ul>
            <br />
            <div className="historyBlock">
              <p className=" text-slate-900 dark:text-[#f8f4eb]">Account</p>
              <hr />
              <ul className="mb-8 space-y-1">
                <li>
                  <a
                    onClick={openSaveDbNameModal}
                    className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  >
                    <SaveDatabase />
                    <span className="ml-3 flex-1 whitespace-nowrap">Save Database</span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={openLoadDbModal}
                    className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  >
                    <LoadDatabase />
                    <span className="ml-3 flex-1 whitespace-nowrap">Load Database</span>
                  </a>
                </li>
                {user ? (
                  <li>
                    <a
                      onClick={() => signoutSession()}
                      className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                    >
                      <SignOut />
                      <span className="ml-3 flex-1 whitespace-nowrap">Sign Out</span>
                    </a>
                  </li>
                ) : null}
              </ul>
            </div>
          </div>
        </aside>

        {/* MODALS */}

        {/* MODAL FOR CONFIRMATION POPUP */}
        <div ref={confirmModal} id="confirmModal" className="confirmModal">
          {/* <!-- Confirm Modal content --> */}
          <div className="modal-content w-[30%] min-w-[300px] max-w-[550px] content-center rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]">
            <p className="mb-4 text-center text-slate-900 dark:text-[#f8f4eb]">
              Are you sure you want to proceed? You will lose <strong>ALL</strong> unsaved
              changes.
            </p>
            <div className="mx-auto flex w-[50%] max-w-[200px] justify-between">
              <button
                onClick={() => closeModal(true)}
                className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
              >
                Confirm
              </button>
              <button
                onClick={() => closeModal(false)}
                className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Query Output Modal */}

        {queryModalOpened ? <QueryModal closeQueryModal={closeQueryModal} /> : null}
        {saveDbNameModalOpened ? (
          <DbNameInput closeSaveDbNameModal={closeSaveDbNameModal} />
        ) : null}
        {loadDbModalOpened ? (
          <LoadDbModal nameArr={nameArr} closeLoadDbModal={closeLoadDbModal} />
        ) : null}
      </div>
    </>
  );
}
