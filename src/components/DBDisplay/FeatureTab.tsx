// React & React Router & React Query Modules

import React, { useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { NavLink } from 'react-router-dom';

const linkbtn = 'mt-4 inline-block lg:mt-0 text-blue-200 hover:text-white mr-4';

// Functions imported:
import parseSql from '../../parse';
// Stores imported:
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

import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';
import useSettingsStore from '../../store/settingsStore';
import useCredentialsStore from '../../store/credentialsStore';

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

  const openQueryModal = () => {
    setQueryModalOpened(true);
  };
  const closeQueryModal = () => {
    setQueryModalOpened(false);
  };
  const openSaveDbNameModal = () => {
    if (!user) alert('Must sign in to save!');
    else {
      setSaveDbNameModalOpened(true);
    }
  };

  const closeSaveDbNameModal = (input: string) => {
    //pull dbName from input field and send it to the database along with the schema.
    saveSchema(input);
    setSaveDbNameModalOpened(false);
  };

  const pureCloseSaveDbNameModal = () => {
    setSaveDbNameModalOpened(false);
  };
  const pureCloseLoadDbModal = () => {
    setLoadDbModalOpened(false);
  };

  //open loadDbName Modal and send get request to database to get all the database names.
  const openLoadDbModal = async (): Promise<string[]> => {
    buildDatabase();
    if (!user) {
      alert('Must sign in to save!');
      return Promise.reject('User not signed in');
    } else {
      const response = await axios
        .get<string[]>('/api/saveFiles/allSave')
        .then((res: AxiosResponse<string[]>) => {
          const nameArr = [];
          for (let saveName of res.data.data) {
            nameArr.push(saveName.SaveName);
          }
          setLoadDbModalOpened(true);
          setNameArr(nameArr);
          // return nameArr;
        })
        .catch((err) => {
          console.error('Err', err);
          return Promise.reject(err);
        });
    }
    return [];
  };

  const closeLoadDbModal = (input: string) => {
    loadSchema(input);
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
        .then((res: AxiosResponse<string[]>) => {
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
  let hoverOverLogoTimeout;
  let ImgSwap;
  function logoImageFlow(event) {
    //let currentLogoImg = event.target.src;
    let logoImgArr = [
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
  function clearImgSwap(event) {
    event.target.src = logo;
    clearInterval(ImgSwap);
  }

  //on click function for revealing/hiding the nav bar db - 7.0
  let logoClicked = false;
  function revealHideNav(event) {
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
          <div className="menuBar light:bg-sky-800 ml-9 overflow-auto rounded px-6 py-8 transition-colors duration-500">
            {theme === 'Light' ? (
              <img
                className="pointer-events-auto mb-1 mt-14 inline-block h-[45] h-[88px] w-[200px] fill-current  pr-3"
                src={logo}
                alt="Logo"
                onMouseOver={logoImageFlow}
                onMouseOut={clearImgSwap}
                onClick={revealHideNav}
              />
            ) : (
              <img
                className="pointer-events-auto mb-1 mt-14 inline-block h-[45] h-[88px] w-[200px] pr-3 invert filter"
                src={logo}
                alt="Logo"
                onMouseOver={logoImageFlow}
                onMouseOut={clearImgSwap}
                onClick={revealHideNav}
              />
            )}

            <NavLink to="/" className={linkbtn}>
              <div className="inline-flex h-10 w-[232px] items-center justify-start gap-3 rounded-lg py-2 pl-1 pr-[54.52px]">
                {/* width="28" height="28" viewBox="0 0 35 28" fill="none"   */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  className="h-6 h-6 w-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                >
                  <g clip-path="url(#clip0_107_1134)">
                    <path
                      d="M24.6255 25.5284H16.7504V18.2159H12.2503V25.5284H4.37524V13.7159C4.37524 13.4054 4.62668 13.1534 4.93775 13.1534C5.24882 13.1534 5.50026 13.4054 5.50026 13.7159V24.4034H11.1253V17.0909H17.8754V24.4034H23.5004V14.2784C23.5004 13.9679 23.7519 13.7159 24.0629 13.7159C24.374 13.7159 24.6255 13.9679 24.6255 14.2784V25.5284Z"
                      fill="white"
                    />
                    <path
                      d="M27.4379 13.716C27.2979 13.716 27.1583 13.6643 27.0492 13.5602L14.5003 1.557L1.95134 13.5602C1.7269 13.7745 1.37083 13.7672 1.15596 13.5428C0.94108 13.3183 0.949518 12.9623 1.17339 12.7474L14.5003 0L27.8266 12.7468C28.0505 12.9617 28.0589 13.3178 27.844 13.5422C27.7338 13.6575 27.5864 13.716 27.4379 13.716Z"
                      fill="white"
                    />
                    <path
                      d="M22.9378 6.96594C22.6267 6.96594 22.3753 6.71394 22.3753 6.40344V3.02844H19.0002C18.6892 3.02844 18.4377 2.77644 18.4377 2.46594C18.4377 2.15544 18.6892 1.90344 19.0002 1.90344H23.5003V6.40344C23.5003 6.71394 23.2489 6.96594 22.9378 6.96594Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_107_1134">
                      <rect
                        width="40"
                        height="27"
                        fill="white"
                        transform="translate(0.745117 0.120605)"
                      />
                    </clipPath>
                  </defs>
                </svg>
                <div className="inline-flex flex-col items-start justify-start pr-[2.48px]">
                  <div className="text-md text-slate-900 dark:text-[#f8f4eb]">Home</div>
                </div>
              </div>
            </NavLink>

            <button onClick={toggleClass}>
              <div className="ItemLink inline-flex h-10 w-[232px] items-center justify-start gap-0 rounded-lg py-2 pl-0 pr-0">
                <svg
                  fill="black"
                  viewBox="0 0 24 24"
                  className="white:invert ml-2 mr-2 inline-block h-[25] rounded-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M1.50488 10.7569C1.50488 16.4855 6.14803 21.1294 11.8756 21.1294C16.2396 21.1294 19.974 18.4335 21.5049 14.616C20.3104 15.0962 19.0033 15.3668 17.6372 15.3668C11.9095 15.3668 7.26642 10.7229 7.26642 4.99427C7.26642 3.63427 7.53299 2.3195 8.00876 1.12939C4.19637 2.66259 1.50488 6.39536 1.50488 10.7569Z"
                    stroke="white"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <div className="DarkMode text-sm leading-normal dark:text-[#f8f4eb]">
                  {theme} Mode
                </div>
              </div>
            </button>

            <p className="mb-1 mt-4 text-slate-900 dark:text-[#f8f4eb]">Action</p>
            <hr />
            <ul className="mt-1 space-y-0">
              <li>
                <a
                  onClick={connectDb}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                  data-testid="connect-database"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 h-6 w-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244"
                    />
                  </svg>
                  <span className="ml-3">Connect Database</span>
                </a>
              </li>
              <li>
                <a
                  onClick={uploadSQL}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                    />
                  </svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">Upload SQL File</span>
                  <span className="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"></span>
                </a>
              </li>
              <li>
                <a
                  onClick={buildDb}
                  className=" flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                    />
                  </svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">Build Database</span>
                </a>
              </li>
              {/* TODO: Add SAVE feature */}
              <li>
                <a
                  onClick={openQueryModal}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9"
                    />
                  </svg>
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
                    className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
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
                    className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 16.875h3.375m0 0h3.375m-3.375 3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">Delete Table</span>
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  onClick={clearCanvas}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">Clear Canvas</span>
                </a>
              </li>
              {/* TODO: Add UNDO & REDO feature */}
              <li>
                <a
                  onClick={undoHandler}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3"
                    />
                  </svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">Undo</span>
                </a>
              </li>
              <li>
                <a
                  onClick={redoHandler}
                  className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
                    />
                  </svg>
                  <span className="ml-3 flex-1 whitespace-nowrap">Redo</span>
                </a>
              </li>
            </ul>
            <br />
            <div className="historyBlock">
              <p className="mb-1 text-slate-900 dark:text-[#f8f4eb]">Account</p>
              <hr />
              <ul className="mb-8 space-y-1">
                <li>
                  <a
                    onClick={openSaveDbNameModal}
                    className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"
                      />
                      <polyline points="17 21 17 13 7 13 7 21" />{' '}
                      <polyline points="7 3 7 8 15 8" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">Save Database</span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={openLoadDbModal}
                    className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                      />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="ml-3 flex-1 whitespace-nowrap">Load Database</span>
                  </a>
                </li>
                {user ? (
                  <li>
                    <a
                      onClick={() => signoutSession()}
                      className="flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:bg-gray-100 dark:text-[#f8f4eb] dark:hover:bg-gray-700"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="h-6 w-6 flex-shrink-0 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:stroke-[#f8f4eb] dark:text-gray-400 dark:group-hover:text-white"
                      >
                        <path stroke="none" d="M0 0h24v24H0z" />
                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                        <path d="M7 12h14l-3 -3m0 6l3 -3" />
                      </svg>
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
          <DbNameInput
            closeSaveDbNameModal={closeSaveDbNameModal}
            pureCloseSaveDbNameModal={pureCloseSaveDbNameModal}
          />
        ) : null}
        {loadDbModalOpened ? (
          <LoadDbModal
            nameArr={nameArr}
            closeLoadDbModal={closeLoadDbModal}
            pureCloseLoadDbModal={pureCloseLoadDbModal}
          />
        ) : null}
      </div>
    </>
  );
}
