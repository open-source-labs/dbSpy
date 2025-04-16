// React & React Router & React Query Modules;
import React, { useState, ReactNode } from 'react';
import axios from 'axios';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import informationIcon from '../../../src/assets/informationIcon2.png';

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
  const setDataStore = useDataStore((state) => state.setDataStore);
  const { setWelcome } = useSettingsStore((state) => state);
  const [dbName, setDBName] = useState('');
  //used to signal whether loading indicator should appear on sidebar or not, if connect button is pressed
  const [connectPressed, setConnectPressed] = useState(false);
  //used to signal whether full database url input should display in form
  const [_selected, setSelected] = useState('postgres');
  const infoIconStr: string =
    "Format: {DatabaseType}://{Username}:{Password}@{Host Name or Server Name or End Point}:{Port}/{DatabaseName}' *:port is optional and may not be needed";

  //form state hooks
  const [formValues, setFormValues] = useState<{
    db_type: string;
    database_link?: string;
    hostname?: string;
    port?: string;
    username?: string;
    password?: string;
    database_name?: string;
    service_name?: string;
    file_path?: string;
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
      switch (splitURI[0]) {
        case 'mysql:':
          const mysqlName = splitURI[3].split('?');
          const mysqlPort = splitURI[2].split(':')[2];
          const internalLinkArray_mySQL = splitURI[2].split(':')[1].split('@');
          values.hostname = internalLinkArray_mySQL[1];
          values.username = splitURI[2].split(':')[0];
          values.password = internalLinkArray_mySQL[0];
          values.port = mysqlPort ? mysqlPort : '3306';
          values.database_name = mysqlName[0];
          values.db_type = 'mysql';
          break;
        case 'mssql:':
          const mssqlName = splitURI[3];
          const mssqlPort = splitURI[2].split(':')[2];
          const internalLinkArray_mssql = splitURI[2].split(':')[1].split('@');
          values.hostname = internalLinkArray_mssql[1];
          values.username = splitURI[2].split(':')[0];
          values.password = internalLinkArray_mssql[0];
          values.port = mssqlPort ? mssqlPort : '1433';
          values.database_name = mssqlName;
          values.db_type = 'mssql';
          break;
        case 'oracle:':
          const oracleName = splitURI[3];
          const oraclePort = splitURI[2].split(':')[2];
          const internalLinkArray_oracle = splitURI[2].split(':')[1].split('@');
          values.hostname = internalLinkArray_oracle[1];
          values.username = splitURI[2].split(':')[0];
          values.password = internalLinkArray_oracle[0];
          values.port = oraclePort ? oraclePort : '1521';
          values.database_name = oracleName;
          values.db_type = 'oracle';
          values.service_name = values.service_name;
          break;
        default: // PostgreSQL
          const postgresName = splitURI[3];
          const postgresPort = splitURI[2].split(':')[2];
          const internalLinkArray_Postgres = splitURI[2].split(':')[1].split('@');
          values.hostname = internalLinkArray_Postgres[1];
          values.username = splitURI[2].split(':')[0];
          values.password = internalLinkArray_Postgres[0];
          values.port = postgresPort ? postgresPort : '5432';
          values.database_name = postgresName;
          // values.database_link = fullLink;
          values.db_type = 'postgres';
          break;
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
      .get(`/api/sql/${values.db_type}/schema`, { params: values })
      .then((res) => {
        return res.data;
      })
      .catch((err: ErrorEvent) => console.error('getSchema error', err));
    setSchemaStore(dataFromBackend.schema);
    setDataStore(dataFromBackend.data);
    setWelcome(false);
    setConnectPressed(false);
    props.closeNav();
  };

  //on change for db type selection, will affect state to conditionally render database URL
  const handleChange = (event: any) => {
    setSelected(event.target.value);
    if (event.target.value === 'oracle') {
      setFormValues({ ...formValues, service_name: 'ORCL' });
      setDBName('oracle');
    } else if (event.target.value === 'sqlite') {
      setDBName('sqlite');
    } else setDBName('');
  };
  //END: HELPER FUNCTIONS

  return (
    <form
      id="dbconnect"
      className="rounded-2xl bg-[#fbf3de] bg-opacity-0 bg-gradient-to-b from-accent to-transparent backdrop-blur-md dark:from-accent"
    >
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
          <option value="sqlite">SQLite3</option>
        </select>
      </span>
      <br></br>
      <div>
        {dbName !== 'sqlite' && (
          <div className="form-item">
            <span className="position flex">
              <label htmlFor="database_link" className="rounded-md dark:text-[#f8f4eb] ">
                Full Database Link
              </label>
              <Tippy content={infoIconStr} placement="top" trigger="mouseenter click">
                <img
                  src={informationIcon}
                  alt="Information Icon"
                  className="ml-2 h-3 rounded-full"
                />
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
        {dbName === 'oracle' && (
          <div>
            <br></br>
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
                defaultValue={formValues.service_name}
                onChange={(e) => {
                  setFormValues({ ...formValues, service_name: e.target.value });
                }}
              />
            </span>
          </div>
        )}
        {dbName === 'sqlite' && (
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
                placeholder="file/path/to/your/database.sqlite"
                value={formValues.file_path}
                onChange={(e) => {
                  setFormValues({ ...formValues, file_path: e.target.value });
                }}
              />
            </span>
          </div>
        )}
        {dbName !== 'sqlite' && (
          <>
            <div>
              <br></br>
              <div className="form-item dark:text-[#f8f4eb]">
                <p className="flex justify-center text-2xl">
                  <b>OR</b>
                </p>
              </div>
              <br></br>
            </div>
            <span className="form-item">
              <label htmlFor="hostname" className="dark:text-[#f8f4eb]">
                Host
              </label>
              <input
                className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
                type="text"
                id="hostname"
                name="hostname"
                autoComplete="off"
                onChange={(e) =>
                  setFormValues({ ...formValues, hostname: e.target.value })
                }
              />
            </span>
            <span className="form-item">
              <label htmlFor="port" className="dark:text-[#f8f4eb]">
                Port
              </label>
              <input
                className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
                type="text"
                id="port"
                name="port"
                autoComplete="off"
                onChange={(e) => setFormValues({ ...formValues, port: e.target.value })}
              />
            </span>
            <span className="form-item">
              <label htmlFor="username" className="dark:text-[#f8f4eb]">
                Database Username
              </label>
              <input
                className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
                type="text"
                id="username"
                name="username"
                autoComplete="off"
                onChange={(e) =>
                  setFormValues({ ...formValues, username: e.target.value })
                }
              />
            </span>
            <span className="form-item">
              <label htmlFor="password" className="dark:text-[#f8f4eb]">
                Database Password
              </label>
              <input
                className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
                type="text"
                id="password"
                name="password"
                autoComplete="off"
                onChange={(e) =>
                  setFormValues({ ...formValues, password: e.target.value })
                }
              />
            </span>
            <span className="form-item">
              <label htmlFor="database_name" className="dark:text-[#f8f4eb]">
                Database Name
              </label>
              <input
                className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
                type="text"
                id="database_name"
                name="database_name"
                autoComplete="off"
                onChange={(e) =>
                  setFormValues({ ...formValues, database_name: e.target.value })
                }
              />
            </span>
            {dbName === 'oracle' ? (
              <span className="form-item">
                <label htmlFor="service_name" className="dark:text-[#f8f4eb]">
                  Service Name
                </label>
                <input
                  className="form-box rounded bg-[#f8f4eb] hover:shadow-sm focus:shadow-inner focus:shadow-[#eae7dd]/75 dark:hover:shadow-[#f8f4eb]"
                  type="text"
                  id="service_name"
                  name="service_name"
                  autoComplete="off"
                  onChange={(e) =>
                    setFormValues({ ...formValues, service_name: e.target.value })
                  }
                />
              </span>
            ) : null}
            <br></br>
          </>
        )}
      </div>
      <button
        className="form-button rounded border bg-[#f8f4eb] px-4 py-2 hover:opacity-80 hover:shadow-inner dark:border-none dark:bg-slate-500 dark:text-[#f8f4eb] dark:hover:shadow-lg"
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
