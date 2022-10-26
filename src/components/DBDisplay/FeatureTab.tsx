// React & React Router & React Query Modules
import React, { useEffect, useState, useRef, ReactComponentElement } from 'react';

// Components imported;
import parseSql from '../../parse';
import DataStore from '../../Store';
import useSchemaStore from '../../store/schemaStore';
import useDataStore from '../../store/dataStore';
import useQueryStore from '../../store/queryStore';
import useFlowStore from '../../store/flowStore';
import useSettingsStore from '../../store/settingsStore';
import createInitialEdges from '../../components/ReactFlow/Edges';
import createInitialNodes from '../../components/ReactFlow/Nodes';

/** "FeatureTab" Component - a tab positioned in the left of the page to access features of the app; */
export default function FeatureTab(props: any) {
  //STATE DECLARATION (dbSpy3.0)
  const {dataStore, setDataStore, dataInd, setDataInd} = useDataStore(state => state);
  const {queryStore, setQueryStore, queryInd, setQueryInd, queryList, setQueryList} = useQueryStore(state => state);
  const {setEdges, setNodes} = useFlowStore(state => state);
  const {schemaStore, setSchemaStore}= useSchemaStore(state => state);
  const {setWelcome}= useSettingsStore(state => state);
  const [action, setAction] = useState(new Array());
  //END: STATE DECLARATION

  //Functions for state management
  const setData = (data:any) =>{
    const newData = {...dataStore };
    newData.set(dataInd, data);
    setDataStore(newData);
    setDataInd(dataInd + 1);
    return dataStore;
  };
  const getData = (ind:number) => dataStore.get(ind);
  const clearDataStore = () => {
    setDataStore(new Map());
    setDataInd(0);
  };
  const getQueries = (ind:number) => queryStore.get(ind);
  const setQueries = (queries: any) => {
    const newQueries = { ...queryStore };
    newQueries.set(queryInd, queries);
    setQueryStore(newQueries);
    setQueryInd(queryInd + 1);
    return queryStore;
  };
  const exportData = () => queryList.map((listItem) => listItem['query']);
  const clearQueryStore = () => {
    setQueryStore(new Map());
    setQueryInd(0);
    setQueryList([]);
  };
  //End: Functions for state management

const [modalOpened, setModalOpened] = useState(false);
const [history, setHistory] = useState([]);
 
  
 /* 
 "undo" - a function that gets invoked when Undo button is clicked; render previous table
 "redo" - a function that gets invoked when Redo button is clicked; render next table
 */
/* 
function undo() {
  if (DataStore.counter > 0) {
    const prev: any = DataStore.getData(DataStore.counter - 1);
    setFetchedData(prev);
    DataStore.counter--;
  }
}

function redo() {
  if (DataStore.counter < DataStore.store.size) {
    const next: any = DataStore.getData(DataStore.counter);
    setFetchedData(next);
    DataStore.counter++;
  }
}
*/

//create references for HTML elements
  const confirmModal: any = useRef();
  /* When the user clicks, open the modal */
  const openModal: any = (callback:any) => {
    confirmModal.current.style.display = "block";
    confirmModal.current.style.zIndex = "100";
    setAction([callback]);
  }
  /* When the user clicks 'yes' or 'no', close it */
  const closeModal: any = (response: boolean) => {
    confirmModal.current.style.display = "none";
    if (response) action[0]();
  }

  //create references for HTML elements
  const addTableModal: any = useRef();
  const tableNameInput: any = useRef();
  /* When the user clicks, open the modal */
  const openAddTableModal = () => {
    addTableModal.current.style.display = "block";
    addTableModal.current.style.zIndex = "100";
    if (!schemaStore) buildDatabase();
  }
  /* When the user clicks 'yes' or 'no', close it */
  const closeAddTableModal = (response: boolean) => {
    addTableModal.current.style.display = "none";
    if (response) addTable(tableNameInput.current.value);
    tableNameInput.current.value = '';
  }



// HELPER FUNCTIONS

  const connectDb = () => {
    //if Flow is rendered, openModal
    if (document.querySelector('.flow'))
      openModal(props.handleSidebar);
    else props.handleSidebar();
  }
  const uploadSQL = () => {
    //if Flow is rendered, openModal
    if (document.querySelector('.flow'))
      openModal(getSchemaFromFile);
    else getSchemaFromFile();
  }

  const buildDb = () => {
    //if Flow is rendered, open modal
    if (document.querySelector('.flow'))
      openModal(buildDatabase);
    else buildDatabase();
  }

  const clearCanvas = () => {
    //if Flow is rendered, open modal
    if (document.querySelector('.flow'))
      openModal(clearCanvasTables);
    else clearCanvasTables();
  }

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
        const parsedData:any = parseSql(event.target.result);
        setSchemaStore(parsedData);
      const initialEdges = createInitialEdges(parsedData);
      setEdges(initialEdges);
      const initialNodes = createInitialNodes(parsedData, initialEdges);
      setNodes(initialNodes);
      setWelcome(false);
      };
    };
  }
   
  const buildDatabase = () => {
    setSchemaStore(null);
    setNodes([]);
    setEdges([]);
    setWelcome(false);
  }

  const addTable = (tableName: string) => {
    let currentSchema = {};
    if(schemaStore) { 
      currentSchema = {...schemaStore};
    }
    currentSchema[tableName] = {};  
    setSchemaStore(currentSchema);
    const initialEdges = createInitialEdges(currentSchema);
    setEdges(initialEdges);
    const initialNodes = createInitialNodes(currentSchema, initialEdges);
    setNodes(initialNodes);
  }

  const clearCanvasTables = () => {
    setSchemaStore(null);
    setDataStore(null);
    setEdges([]);
    setNodes([]);
    setWelcome(false);
  }

// END: HELPER FUNCTIONS

  return (
    <>
    <div className="max-w-2xl mx-auto">
    <aside className="w-64 absolute inset-y-0 left-0 top-24 featureTab" aria-label="FeatureTab">
      <div className="px-3 py-4 overflow-y-auto rounded bg-[#f8f4eb] dark:bg-gray-800 menuBar transition-colors duration-500 shadow-lg">
        <p className='text-slate-900 dark:text-[#f8f4eb]'>Action</p>
        <hr />
        <ul className="space-y-2">
          <li>
            <a 
              onClick={connectDb}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-[#f8f4eb] hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:stroke-[#f8f4eb]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span className="ml-3">Connect Database</span>
            </a>
          </li>
          <li>
            <a
              onClick={uploadSQL} 
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-[#f8f4eb] hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:stroke-[#f8f4eb]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Upload SQL File</span>
              <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"></span>
            </a>
          </li>
          <li>
            <a
              onClick={buildDb}
              className=" cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-[#f8f4eb] hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:stroke-[#f8f4eb]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Build Database</span>
            </a>
          </li>
          
          <li>
            <a
              onClick={() => alert('Feature coming soon!')}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-[#f8f4eb] hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:stroke-[#f8f4eb]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Save</span>
            </a>
          </li>
          <br />
          <p className='text-slate-900 dark:text-[#f8f4eb]'>Edit</p>
          <hr />
          <li>
            <a
              onClick={openAddTableModal}  
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-[#f8f4eb] hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:stroke-[#f8f4eb]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Add Table</span>
            </a>
          </li>
          <li>
            <a
              onClick={clearCanvas}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-[#f8f4eb] hover:bg-gray-100 dark:hover:bg-gray-700"
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:stroke-[#f8f4eb]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Clear Canvas</span>
            </a>
          </li>
          <li>
            <a
             /*  onClick={undo} */
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-[#f8f4eb] hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:stroke-[#f8f4eb]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Undo</span>
            </a>
          </li>
          <li>
            <a
           /*    onClick={redo} */
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-[#f8f4eb] hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white dark:stroke-[#f8f4eb]">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Redo</span>
            </a>
          </li>
        </ul>
        <br />
        <div className='historyBlock'>
          <p className='text-slate-900 dark:text-[#f8f4eb]'>History</p>
          <hr />
          {history}
        </div>
      </div>
    </aside>

    {/* MODAL FOR CONFIRMATION POPUP */}
    <div ref={confirmModal} id="confirmModal" className="confirmModal">
      {/* <!-- Confirm Modal content --> */}
      <div className="modal-content content-center bg-[#f8f4eb] dark:bg-slate-800 rounded-md border-0 w-[30%] min-w-[300px] max-w-[550px] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:shadow-[0px_5px_10px_#1e293b]">
        <p className="text-center mb-4 text-slate-900 dark:text-[#f8f4eb]">Are you sure you want to proceed? You will lose <strong>ALL</strong> unsaved changes.</p>
        <div className='flex justify-between w-[50%] max-w-[200px] mx-auto'>
          <button onClick={()=>closeModal(true)} className="text-slate-900 dark:text-[#f8f4eb] modalButton">Confirm</button>
          <button onClick={()=>closeModal(false)} className="text-slate-900 dark:text-[#f8f4eb] modalButton">Cancel</button>
        </div> 
      </div>
    </div>

    {/* MODAL FOR ADD NEW TABLE POPUP */}
    <div ref={addTableModal} id="addTableModal" className="addTableModal">
      {/* <!-- Add Table Modal content --> */}
      <div className="modal-content content-center bg-[#f8f4eb] dark:bg-slate-800 rounded-md border-0 w-[30%] min-w-[300px] max-w-[550px] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:shadow-[0px_5px_10px_#1e293b]">
        <p className="text-center mb-4 text-slate-900 dark:text-[#f8f4eb]">Enter your table name.</p>
        <div className='flex justify-between w-[50%] max-w-[200px] mx-auto'>
          <input ref={tableNameInput} />
          <button onClick={()=>closeAddTableModal(true)} className="text-slate-900 dark:text-[#f8f4eb] modalButton">Proceed</button>
          <button onClick={()=>closeAddTableModal(false)} className="text-slate-900 dark:text-[#f8f4eb] modalButton">Cancel</button>
        </div> 
      </div>
    </div>

  </div>
  </>
  );
}
