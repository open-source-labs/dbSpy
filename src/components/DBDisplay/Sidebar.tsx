// React & React Router & React Query Modules;
import React, { useState, ReactNode } from 'react';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import informationIcon from '../../../images/informationIcon2.png'

// Components Imported;
import useCredentialsStore from '../../store/credentialsStore';
import useSchemaStore from '../../store/schemaStore';
import useSettingsStore from '../../store/settingsStore';
import useDataStore from '../../store/dataStore';
// const server_url = process.env.NODE_ENV === 'dev' ? process.env.DEV_SERVER_ENDPOINT : process.env.SERVER_ENDPOINT


const Sidebar = (props: any) => {
  //STATE DECLARATION (dbSpy3.0)
  const setDbCredentials = useCredentialsStore((state) => state.setDbCredentials);
  const setSchemaStore = useSchemaStore((state) => state.setSchemaStore);
  const setDataStore = useDataStore((state) => state.setDataStore)
  const { setWelcome } = useSettingsStore((state) => state);
  const [serviceName, setServiceName] = useState('');
  //used to signal whether loading indicator should appear on sidebar or not, if connect button is pressed
  const [connectPressed, setConnectPressed] = useState(false);
  //used to signal whether full database url input should display in form
  const [_selected, setSelected] = useState('postgres');
  const infoIconStr: string = "Format: {DatabaseType}://{Username}:{Password}@{Host Name or Server Name or End Point}:{Port}/{DatabaseName}' *:port is optional and may not be needed" 

    //form state hooks
    const [formValues, setFormValues] = useState<{ 
      db_type: string,
      database_link?: string,
      hostname?: string,
      port?: string,
      username?:string,
      password?: string,
      database_name?: string,
      service_name?: string,
      file_path?: string,
     }>({ db_type: 'postgres' });
  //END: STATE DECLARATION

  //HELPER FUNCTIONS
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    const values: any = formValues;
    //parsing postgres database URL defers from parsing mySQL database URL
    if (values.database_link) {
      const fullLink = values.database_link;
      const splitURI = fullLink.split('/');
      //console.log('fullLink: ', fullLink)
      //console.log('splitURI: ', splitURI)
      if (splitURI[0] === 'postgres:') {
        const name_postgres = splitURI[3];
        const internalLinkArray_Postgres = splitURI[2].split(':')[1].split('@');
        values.hostname = internalLinkArray_Postgres[1];
        values.username = name_postgres.split(':')[0];
        values.password = internalLinkArray_Postgres[0];
        values.port = '5432';
        values.database_name = name_postgres;
        values.db_type = 'postgres';
      } else if (splitURI[0] === 'mysql:') {
        const name_mySQL = splitURI[3].split('?');
        const internalLinkArray_mySQL = splitURI[2].split(':')[1].split('@');
        values.hostname = internalLinkArray_mySQL[1];
        values.username = splitURI[2].split(':')[0];
        values.password = internalLinkArray_mySQL[0];
        values.port = '3306';
        values.database_name = name_mySQL[0];
        values.db_type = 'mysql';
      } else if (splitURI[0] === 'mssql:') {
        const name_mssql = splitURI[3];
        const internalLinkArray_mssql = splitURI[2].split(':')[1].split('@');
        values.hostname = internalLinkArray_mssql[1];
        values.username = splitURI[2].split(':')[0];
        values.password = internalLinkArray_mssql[0];
        values.port = '1433';
        values.database_name = name_mssql;
        values.db_type = 'mssql';
      } else if (splitURI[0] === 'oracle:') {
        const name_oracle = splitURI[3];
        const internalLinkArray_oracle = splitURI[2].split(':')[1].split('@');
        values.hostname = internalLinkArray_oracle[1];
        values.username = splitURI[2].split(':')[0];
        values.password = internalLinkArray_oracle[0];
        values.port = '1521';
        values.database_name = name_oracle;
        values.db_type = 'oracle';
        values.service_name = values.service_name;
      }
    } else if (values.file_path) {
      values.db_type = 'sqlite';
      values.database_name = values.file_path;
    }

    //update dbCredentials
    setDbCredentials(values);
    setConnectPressed(true);

    //change between which getSchema from MySQL to postgres based on db_type

    const dataFromBackend = await axios
      .get(`api/sql/${values.db_type}/schema`, { params: values })
      .then((res) => {
        //console.log('data from back',res.data)
        return res.data;
      })
      .catch((err: ErrorEvent) => console.error('getSchema error', err));
    setSchemaStore(dataFromBackend.schema);
    setDataStore(dataFromBackend.data)
    setWelcome(false);
    setConnectPressed(false);
    props.closeNav();
  };
  
  //on change for db type selection, will affect state to conditionally render database URL
  const handleChange = (event: any) => {
    setSelected(event.target.value);
    if (event.target.value === 'oracle') {
      setServiceName('oracle');
    } else if (event.target.value === 'sqlite') {
      setServiceName('sqlite');
    } else setServiceName('');
  };
  //END: HELPER FUNCTIONS

  return (
    <form id="dbconnect" className="bg-[#fbf3de] dark:bg-slate-700">
      <label className="dark:text-[#f8f4eb]">
        <h3>Connect to Database</h3>
      </label>
      <br></br>
      <span className="form-item">
        <label htmlFor="db_type" className="dark:text-white">
          Database Type
        </label>
        <select
          className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
          id="db_type"
          name="db_type"
          onChange={(e) => {
            setFormValues({ ...formValues, db_type: e.target.value });
            handleChange(e);
          }}
        >
          <option value="postgres">PostgreSQL</option>
          <option value="mysql">MySQL</option>
          <option value="mssql">Microsoft SQL</option>
          <option value="oracle">Oracle SQL (requires OCI)</option>
          
          {/* <option value="sqlite">SQLite3</option> */}
        </select>
      </span>
      <br></br>
      <div>
      {(serviceName !== 'sqlite') && (
        <div className="form-item">
          <span className="flex position">
            <label htmlFor="database_link" className="dark:text-[#f8f4eb] rounded-md ">
              Full Database Link
            </label>
              <Tippy content={infoIconStr} placement="top" trigger="mouseenter click">
                <img src={informationIcon} alt="Information Icon" className="h-3 rounded-full ml-2" />
              </Tippy>
          </span>
          <input
            className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
            type="text"
            id="database_link "
            name="database_link"
            autoComplete="off"
            onChange={(e) =>
              setFormValues({ ...formValues, database_link: e.target.value })
            }
          />
        </div>
      )}
      {(serviceName === 'oracle') && (
        <div> 
          <span className="form-item">
            <label htmlFor="service-name" className="dark:text-[#f8f4eb]">
              Service Name
            </label>
            <input
              className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
              type="text"
              id="service-name"
              name="service-name"
              autoComplete="off"
              placeholder='ORCL'
              value={formValues.service_name}
              onChange={
                (e) => { 
                setFormValues({ ...formValues, service_name: e.target.value });
              }
            }/>
          </span>
          <span className="flex justify-start items-center space-x-2 mt-3">
            <p className="align-middle dark:text-[#f8f4eb]">Default:</p>
            <button className="form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:opacity-80 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg"
                    onClick={(e) => { e.preventDefault()
                    setFormValues({ ...formValues, service_name: 'ORCL' })}}>
              ORCL
            </button>
          </span>
        </div> 
      )}
      {(serviceName === 'sqlite') && (
        <div> 
          <span className="form-item">
            <label htmlFor="service-name" className="dark:text-[#f8f4eb]">
              File path to your SQLite database
            </label>
            <input
              className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
              type="text"
              id="file-path"
              name="file-path"
              autoComplete="off"
              placeholder='file/path/to/your/database.sqlite'
              value={formValues.file_path}
              onChange={
                (e) => { 
                setFormValues({ ...formValues, file_path: e.target.value });
              }
            }/>
          </span>
        </div> 
      )}
      {(serviceName !== 'sqlite') && (
        <><div>
          <br></br>
          <div className="form-item dark:text-[#f8f4eb]">
            <p className="">OR</p>
          </div>
          <br></br>
        </div><span className="form-item">
            <label htmlFor="hostname" className="dark:text-[#f8f4eb]">
              Host
            </label>
            <input
              className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
              type="text"
              id="hostname"
              name="hostname"
              autoComplete="off"
              onChange={(e) => setFormValues({ ...formValues, hostname: e.target.value })} />
          </span><span className="form-item">
            <label htmlFor="port" className="dark:text-[#f8f4eb]">
              Port
            </label>
            <input
              className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
              type="text"
              id="port"
              name="port"
              autoComplete="off"
              onChange={(e) => setFormValues({ ...formValues, port: e.target.value })} />
          </span><span className="form-item">
            <label htmlFor="username" className="dark:text-[#f8f4eb]">
              Database Username
            </label>
            <input
              className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
              type="text"
              id="username"
              name="username"
              autoComplete="off"
              onChange={(e) => setFormValues({ ...formValues, username: e.target.value })} />
          </span><span className="form-item">
            <label htmlFor="password" className="dark:text-[#f8f4eb]">
              Database Password
            </label>
            <input
              className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
              type="text"
              id="password"
              name="password"
              autoComplete="off"
              onChange={(e) => setFormValues({ ...formValues, password: e.target.value })} />
          </span><span className="form-item">
            <label htmlFor="database_name" className="dark:text-[#f8f4eb]">
              Database Name
            </label>
            <input
              className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
              type="text"
              id="database_name "
              name="database_name"
              autoComplete="off"
              onChange={(e) => setFormValues({ ...formValues, database_name: e.target.value })} />
          </span><br></br></>
      )}
      </div>
        <button
          className="form-button rounded border bg-[#f8f4eb] py-2 px-4 hover:opacity-80 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg"
          id="submit"
          onClick={(e) => handleSubmit(e)}
        >
          Connect
        </button>
      <br></br>
        {!connectPressed ? (
          <div className="h-[58px]"></div>
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <div className="flex items-center justify-center space-x-1 dark:text-[#f8f4eb]">
              <svg
                fill="none"
                className="h-6 w-6 animate-spin"
                viewBox="0 0 32 32"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  clipRule="evenodd"
                  d="M15.165 8.53a.5.5 0 01-.404.58A7 7 0 1023 16a.5.5 0 011 0 8 8 0 11-9.416-7.874.5.5 0 01.58.404z"
                  fill="currentColor"
                  fillRule="evenodd"
                />
              </svg>
            <div>
              <p>Loading...</p>
              <p>Please wait, this could take a minute</p>
            </div>
          </div>
        </div>
      )}
    </form>
  );
};

export default Sidebar;
