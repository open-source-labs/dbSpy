// React & React Router & React Query Modules
import React, { useState, useRef } from 'react';
import axios, { AxiosResponse } from 'axios';
import { NavLink, useNavigate } from 'react-router-dom';
import { useNavStore } from '../../store/navStore';
import { useModalStore } from '../../store/useModalStore';

// Functions imported:
import parseSql from '../../parse';

// Stores imported:
import useDataStore from '../../store/dataStore';
import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';
import useSettingsStore from '../../store/settingsStore';
import useCredentialsStore from '../../store/credentialsStore';
//import icon
import {
  ConnectDatabaseIcon,
  UploadSQLFileIcon,
  ExportQueryIcon,
  AddTableIcon,
  DeleteTableIcon,
  DeleteIcon,
  UndoIcon,
  RedoIcon,
  SaveDatabaseIcon,
  LoadDatabaseIcon,
  SignOutIcon,
  BuildDatabaseIcon,
} from '../../FeatureTabIcon';
// Components imported:
import QueryModal from '../Modals/QueryModal';
import DbNameInput from '../Modals/DbNameInput';
import LoadDbModal from '../Modals/LoadDbModal';
import DeleteDbModal from '../Modals/DeleteDbModal';

/** "FeatureTab" Component - a tab positioned in the left of the page to access features of the app; */
export default function FeatureTab(props: any) {
  // dbSpy 8.0: get the state store in Zustand
  const toggleClicked = useNavStore((state) => state.toggleClicked);
  const { openQueryModal, closeQueryModal, queryModalOpened } = useModalStore();

  const navigate = useNavigate();

  //STATE DECLARATION (dbSpy3.0)
  const { setEdges, setNodes } = useFlowStore((state) => state);

  const { dataStore, setDataStore } = useDataStore((state) => state);
  //-- TO DELETE
  // const { schemaStore, setSchemaStore, undoHandler, redoHandler } = useSchemaStore(
  //   (state) => state
  // );

  const { schemaStore, setSchemaStore, undoHandler, redoHandler } = useSchemaStore(
    (state) => state
  );
  const { user } = useCredentialsStore((state: any) => state);

  const { setWelcome, isSchema, setDBName } = useSettingsStore((state) => state);
  const [action, setAction] = useState(new Array());
  // const [queryModalOpened, setQueryModalOpened] = useState(false);
  const [saveDbNameModalOpened, setSaveDbNameModalOpened] = useState(false);
  const [loadDbModalOpened, setLoadDbModalOpened] = useState(false);
  const [deleteDbModalOpened, setDeleteDbModalOpened] = useState(false);
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
    // dbSpy 8.0: add function to Connect Database to redirect back if not on Display
    if (window.location.pathname !== '/display') {
      openModal(() => {
        // Navigate to the display page if the user confirms
        navigate('/display');
      });
    } else {
      // Already on display page, proceed with connecting the database
      //if Flow is rendered, openModal
      if (document.querySelector('.flow')) openModal(props.handleSidebar);
      else props.handleSidebar();
    }
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

  // // Export QueryModal
  // const openQueryModal = () => {
  //   setQueryModalOpened(true);
  // };
  // const closeQueryModal = () => {
  //   setQueryModalOpened(false);
  // };

  //SaveDbNameModal - dbSpy 7.0
  const openSaveDbNameModal = () => {
    if (!user) alert('Must sign in to save!');
    else {
      setSaveDbNameModalOpened(true);
    }
  };

  const closeSaveDbNameModal = (input?: string) => {
    //pull dbName from input field and send it to the database along with the schema. - dbSpy 7.0
    if (input) {
      saveSchema(input);
    }
    setSaveDbNameModalOpened(false);
  };

  // LoadDbModal
  // Open loadDbName Modal and send get request to database to get&list all the databases name. - dbSpy 7.0
  const openLoadDbModal = async (): Promise<string[]> => {
    if (!user) {
      alert('Must sign in to load!');
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

  const openDeleteDbModal = async (): Promise<string[]> => {
    if (!user) {
      alert('Please sign in first!');
      return Promise.reject('User not signed in');
    } else {
      const response = await axios
        .get<string[]>('/api/saveFiles/allSave')
        .then((res: AxiosResponse) => {
          const nameArr = [];
          for (let saveName of res.data.data) {
            nameArr.push(saveName.SaveName);
          }
          setDeleteDbModalOpened(true);
          setNameArr(nameArr);
        })
        .catch((err) => {
          console.error('Err', err);
          return Promise.reject(err);
        });
    }
    return [];
  };
  // Load selected database - dbSpy 7.0
  const closeLoadDbModal = (input?: string) => {
    if (input) {
      loadSchema(input);
      setDBName(input);
    }
    setLoadDbModalOpened(false);
  };
  // Delete selected database - dbSpy 7.0
  const closeDeleteDbModal = (input?: string) => {
    if (input) {
      deleteDatabase(input);
    }
    setDeleteDbModalOpened(false);
  };

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
      console.log(err);
      console.error('err retrieve', err);
      window.alert(err);
    }
  };
  // Function for deleting databases - dbspy 7.0
  const deleteDatabase = (inputName: string) => {
    try {
      //send the inputName along with the delete request as query in the parameters.
      axios
        .delete(`/api/saveFiles/deleteSave/${inputName}`)
        .catch((err) => console.error('err', err));
    } catch (err) {
      console.log(err);
      console.error('err retrieve', err);
      window.alert(err);
    }
  };

  // END: HELPER FUNCTIONS

  return (
    <>
      {/* PAGE */}
      {/* MODAL FOR CONFIRMATION POPUP */}
      {/* dbSpy 8.0: move confirmModal to show on whole page */}
      <div
        ref={confirmModal}
        id="confirmModal"
        className="fixed inset-0 z-50 flex hidden items-center justify-center bg-black bg-opacity-50"
      >
        {/* <!-- Confirm Modal content --> */}
        <div className="modal-content w-[30%] min-w-[300px] max-w-[550px] content-center rounded-md border-0 bg-opacity-90 bg-gradient-to-b from-[#f8f4eb] to-transparent shadow-[0px_5px_10px_rgba(0,0,0,0.4)] backdrop-blur-md dark:from-slate-800 dark:to-transparent dark:shadow-[0px_5px_10px_#1e293b]">
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
      {/* dbSpy 8.0: added toggle button in Navbar to control FeatureTab */}
      <div
        className={`bg-blue fixed left-0 top-10 z-10 h-full w-64 transition-transform duration-300 ${
          toggleClicked ? '-translate-x-full' : 'translate-x-0'
        }`}
      >
        {/* dbSpy 8.0: modify other pages to make sure they change with the state of FeatureTab */}
        <aside
          className="featureTab z-index-10 light:bg-sky-800 absolute inset-y-0 left-0 top-24 w-56"
          aria-label="FeatureTab"
        >
          <div className="menuBar light:bg-sky-800 overflow-auto rounded px-5 py-6 transition-colors duration-500">
            {/* ConnectDB code */}
            <p className=" mt-4 text-slate-900 dark:text-[#f8f4eb]">Connect</p>
            <hr />
            <ul className=" space-y-0">
              <li>
                <a
                  onClick={connectDb}
                  className="dark: group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  data-testid="connect-database"
                >
                  <ConnectDatabaseIcon />
                  <span className="ml-3">Connect Database</span>
                </a>
              </li>

              {/* -----------------Upload SQL File Button---------------------- */}
              <li>
                <a
                  onClick={uploadSQL}
                  className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <UploadSQLFileIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">Upload SQL File</span>
                  <span className="ml-3 inline-flex items-center justify-center rounded-full bg-gray-200 px-2 text-sm font-medium text-gray-800 dark:bg-gray-700 dark:text-gray-300"></span>
                </a>
              </li>
              <li>
                <a
                  onClick={buildDb}
                  className=" group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <BuildDatabaseIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">Build Database</span>
                </a>
              </li>
              {/* ------ View Saved Databases ----- */}
              <li>
                {/* TODO: onClick must get updated */}

                <a
                  onClick={buildDb}
                  className=" group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <BuildDatabaseIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    View Saved Databases
                  </span>
                </a>
              </li>

              {/* Commented code is for Export Query Button */}
              {/* TODO: Add SAVE feature */}
              <li>
                <a
                  onClick={openQueryModal}
                  className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline  dark:text-[#f8f4eb] dark:hover:text-yellow-300 "
                >
                  <ExportQueryIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">Export Query</span>
                </a>
              </li>
              <br />
              {/* ----------- 💙💙💙💙 Edit Tab ------------------------- */}
              {/* Adding a Table and its features will be going inside the Main Functionalities from Connect Tab  (STRETCH) */}
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
                    className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300 "
                  >
                    <AddTableIcon />
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
                    className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  >
                    <DeleteTableIcon />
                    <span className="ml-3 flex-1 whitespace-nowrap">Delete Table</span>
                  </a>
                </li>
              ) : null}
              <li>
                <a
                  onClick={clearCanvas}
                  className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900  hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <DeleteIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">Clear Canvas</span>
                </a>
              </li>
              {/* TODO: Add UNDO & REDO feature */}
              <li>
                <a
                  onClick={undoHandler}
                  className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <UndoIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">Undo</span>
                </a>
              </li>
              <li>
                <a
                  onClick={redoHandler}
                  className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <RedoIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">Redo</span>
                </a>
              </li>
              <br />
              {/* ----------- 💙💙💙💙 Test Tab -------------------------- */}
              <p className="text-slate-900 dark:text-[#f8f4eb]">Test</p>
              <hr />

              <li>
                {/* ----- 💙💙 Test New Query Button -------- */}
                <NavLink
                  to="/test-new-query"
                  className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300 "
                >
                  <AddTableIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">Test New Query</span>
                </NavLink>
              </li>

              <li>
                {/* ----- 💙💙 View Saved Queries Button -------- */}
                <NavLink
                  to="/view-saved-queries"
                  className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900  hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                >
                  <AddTableIcon />
                  <span className="ml-3 flex-1 whitespace-nowrap">
                    View Saved Queries
                  </span>
                </NavLink>
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
                    className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  >
                    <SaveDatabaseIcon />
                    <span className="ml-3 flex-1 whitespace-nowrap">Save Database</span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={openLoadDbModal}
                    className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  >
                    <LoadDatabaseIcon />
                    <span className="ml-3 flex-1 whitespace-nowrap">Load Database</span>
                  </a>
                </li>
                <li>
                  <a
                    onClick={openDeleteDbModal}
                    className="group flex cursor-pointer items-center rounded-lg p-2 text-sm font-normal text-gray-900 hover:text-yellow-500 hover:underline dark:text-[#f8f4eb] dark:hover:text-yellow-300"
                  >
                    <DeleteIcon />
                    <span className="ml-3 flex-1 whitespace-nowrap">Delete Database</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        {/* MODALS */}

        {/* Query Output Modal */}
        {/* Sending props to child components. */}
        {/* {queryModalOpened ? <QueryModal closeQueryModal={closeQueryModal} /> : null} */}
        {saveDbNameModalOpened ? (
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
}
