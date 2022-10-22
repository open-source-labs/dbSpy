// React & React Router & React Query Modules;
import React, {
  ReactComponentElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useMutation } from 'react-query';
// Components Imported;
// import Canvas from '../components/DBDisplay/Canvas';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import Sidebar from '../components/DBDisplay/Sidebar';
import Flow from '../components/ReactFlow/Flow';
import useSchemaStore from '../store/schemaStore';
import useCredentialsStore from '../store/credentialsStore';
import createInitialEdges from '../components/ReactFlow/Edges';
import createInitialNodes from '../components/ReactFlow/Nodes';

// Miscellaneous - axios for REST API request, DataStore for global state management, AppShell for application page frame;
import axios from 'axios';
import DataStore from '../Store';
import { AppShell, Box, Button, Collapse, ScrollArea, Text } from '@mantine/core';

//import fileSaver for export queries
import FileSaver from 'file-saver';

interface stateChangeProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  setUser: (user: any) => void;
}

/* "DBDisplay" Component - database visualization application page; only accessible when user is authorized; */
// export default function DBDisplay({ user, setUser }: stateChangeProps) {
export default function DBDisplay() {
  //STATE DECLARATION (dbSpy3.0)
  // const user = useCredentialsStore((state) => state.user);
  // const setUser = useCredentialsStore((state) => state.setUser);
  const schemaStore = useSchemaStore((state) => state.schemaStore);
  //END: STATE DECLARATION

  /* Server Cache State or Form Input State
  "fetchedData" - a state that stores database table model and is used to render database schema tables;
  "tablename" - a state that stores input data (table name for a new table) from "ADD TABLE" feature;
  */
  const [fetchedData, setFetchedData] = useState({});
  const [tablename, setTablename] = useState('');

  const ref = useRef<HTMLDivElement>(null);
  const [logData, setLogData] = useState([]);
  const [logOpened, setLogOpened] = useState(false);
  const [logDisplay, setLogDisplay] = useState([]);

  /* UI State
  "sideBarOpened" - a state that opens and closes the side bar for database connection;
  "menuPopUpOpened" - a state that opens and closes the Menu Pop Up for when burger icon is clicked;
  */
  const [sideBarOpened, setSideBarOpened] = useState(false);
  const [menuPopUpOpened, setMenuPopUpOpened] = useState(false);
  const [queryOpened, setQueryOpen] = useState(true);
  //state to keep track of which SQL syntax Query Generator is generating, Postgres or MySQL.
  const [sqlOpen, setSqlOpen] = useState(true);

  /* useMutation for handling 'POST' request to '/api/getSchema' route for DB schema dump; 
  initiate "fetchedData" and Map objects in "DataStore" 
  onSuccess: update connectedToDB global state to "true" and close the side bar
  */

  const { isLoading, isError, mutate } = useMutation(
    async (dataToSend: object) => {
      const obj = JSON.parse(JSON.stringify(dataToSend));
      let endpoint: string = '/api/getSchema';
      //check if postgres or mySQL
      switch (obj.db_type) {
        case 'PostgreSQL':
          endpoint = '/api/getSchema';
          break;
        case 'mySQL':
          endpoint = '/apimysql/getSchema';
          break;
      }
      //fetch call to back-end
      console.log('DATATOSEND', dataToSend);
      console.log('ENDPOINT', endpoint);
      return axios.post(endpoint, dataToSend).then((res) => {
        // Once connected to Database, we need to clear DataStore and Query, Data, loadedFile from sessionStorage in case the user interacted with SQL load or New Canvas feature.
        DataStore.clearStore();
        sessionStorage.removeItem('Query');
        sessionStorage.removeItem('Data');
        sessionStorage.removeItem('loadedFile');
        // Then, update DataStore table data with response data and set query to empty.
        DataStore.setData(res.data);
        DataStore.setQuery([{ type: '', query: '' }]);
        // Update sessionStorage Data and Query with recently updated DataStore.
        sessionStorage.Data = JSON.stringify(Array.from(DataStore.store.entries()));
        sessionStorage.Query = JSON.stringify(Array.from(DataStore.queries.entries()));
        // Update the rendering of the tables with latest table model.
        setFetchedData(res.data);
        console.log(res.data);
      });
    },
    {
      onSuccess: () => {
        // Upon success of DB connection, we dbConnect in DataStore to "true"
        DataStore.connect();

        // Update sessionStorage.dbConnect to "true" also.
        sessionStorage.dbConnect = 'true';

        // Then close the side bar that was opened.
        setSideBarOpened(false);
      },
      onError: () => {
        // Upon error, we alert the user that there's an issue with DB connection.
        alert('Database connection has failed.');
      },
    }
  );

  /* The two hooks below load log setting info for Postgres DBs after a connection is made */
  useEffect(() => {
    if (sessionStorage.dbConnect === 'true' || sessionStorage.loadedFile === 'true') {
      getLogInfo();
    }
  }, [fetchedData]);

  useEffect(() => {
    logDataForm();
  }, [logData]);

  const logDataForm = () => {
    if (sessionStorage.dbConnect === 'true' || sessionStorage.loadedFile === 'true') {
      let logMap: any = logData.map(
        (
          log: any,
          i: any // TS fix request: type any is required when referencing state. No type was required when referencing res.data.Properties?
        ) => (
          <form onSubmit={handleLogUpdate} id="logSettingsForm">
            <ul className="logUl">
              <li className="logField" id={`logSetting${i}`} key={`logSetting${i}`}>
                {log.Name} ={' '}
                <input
                  className="logInput"
                  id={log.Name}
                  type="text"
                  defaultValue={log.Setting}
                  key={`logInput${i}`}
                />
              </li>
            </ul>
          </form>
        )
      );
      setLogDisplay(logMap);
    }
  };

  // updates state when user changes log settings. Called in button created in getLogInfo()
  const handleLogUpdate = (event: any): any => {
    event.preventDefault();
    const newLogData: any = new Array(logData).flat();
    for (const each of newLogData) {
      each.Setting = (document.getElementById(`${each.Name}`) as HTMLInputElement).value;
    }
    setLogData(newLogData);
    const obj = JSON.parse(JSON.stringify(DataStore.userDBInfo));
    if (obj.db_type === 'PostgreSQL') {
      // TS fix required for log variable in map method
      const outputSqlLog = newLogData
        .map(
          (log: any, i: BigInteger) =>
            `ALTER DATABASE ${obj.database_name} SET ${log.Name} = ${log.Setting}`
        )
        .join('\n');

      const dbName = obj.database_name;
      const saveToApi = { sqlLogs: outputSqlLog, dbName: dbName };
      axios.post('/api/setLogs', saveToApi).then((res) => {});
      const data = new Blob([outputSqlLog], {
        type: 'text/plain;charset=utf-8',
        endings: 'native',
      });
      FileSaver.saveAs(data, 'SQL_LOG_EXPORT.sql');
    }
  };

  //This is the variable for showing the update button
  let buttonVisability = logOpened === false ? 'none' : 'inline-block';

  const openLogs = () => {
    setLogOpened(logOpened === false ? true : false);
  };

  // Pulls log settings from the connected database.
  const getLogInfo = () => {
    const obj: any = JSON.parse(JSON.stringify(DataStore.userDBInfo));
    let endpoint: string = '/api/getLogs';
    let dbConnect: any = obj;

    //check if postgres or mySQL
    switch (obj.db_type) {
      case 'PostgreSQL':
        endpoint = '/api/getLogs';
        // creating URI for server to connect to user's db
        let db_uri: string;
        if (obj.database_link) {
          const name = obj.database_link.split('/');
          name[2] += ':5432';
          const dbURI = name.join('/');
          db_uri = dbURI;
        } else {
          db_uri =
            'postgres://' +
            obj.username +
            ':' +
            obj.password +
            '@' +
            obj.hostname +
            ':' +
            obj.port +
            '/' +
            obj.database_name;
        }
        // uri examples
        // DATABASE_URL=postgres://{user}:{password}@{hostname}:{port}/{database-name}
        // "postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName";
        dbConnect = { uri: db_uri };
        break;

      case 'mySQL':
        endpoint = '/apimysql/getLogs';
        dbConnect = obj;
        break;
    }

    if (DataStore.connectedToDB === false) {
      const warn: any = ['Must connect to database before pulling log settings']; // TS fix request: setLogData requires a type for this simple array but not for an HTML filled array created with .map?
      setLogData(warn);
      return;
    }

    // Makes the fetch call to the DB once connected and runs the select statement to retrieve data from pg_settings
    return axios.post(endpoint, dbConnect).then((res) => {
      console.log('LOGGING OBJECT', res.data.Properties);
      setLogData(res.data.Properties);
    });
  };

  /* useEffect1:
  Updates global state "DataStore" upon landing of the page with sessionStorage data.
  Gets triggered once when landing of the page (i.e. refresh of browser, coming from different pages)
  Client-side caching implemented with latest update of table model. 
  */
  useEffect(() => {
    // if the user is connected to either database or loaded a sql file, AND there's a Data store in sessionStorage, we will go through this useEffect
    if (
      (sessionStorage.dbConnect === 'true' || sessionStorage.loadedFile === 'true') &&
      sessionStorage.Data
    ) {
      // if the user is connected to Database, update DataStore with dbConnect and userDBInfo
      if (sessionStorage.dbConnect && sessionStorage.userDBInfo) {
        DataStore.connect();
        DataStore.userDBInfo = JSON.parse(sessionStorage.userDBInfo);
        // if the user uploaded a sql file, update DataStore with loadedFile
      } else if (sessionStorage.loadedFile) {
        DataStore.loadedFile = true;
      }

      // parse the Data and Query from sessionStorage and grab the latest table model from savedData
      const savedData: any = new Map(JSON.parse(sessionStorage.Data));
      const savedQuery: any = new Map(JSON.parse(sessionStorage.Query));
      const latestData: any = savedData.get(savedData.size - 1);

      //Update DataStore with all of the table models and queries saved before refresh of the browser.
      DataStore.store = savedData;
      DataStore.queries = savedQuery;
      DataStore.ind = DataStore.queryInd = DataStore.store.size;
      DataStore.queryList = savedQuery.get(savedQuery.size - 1);

      //Update fetchedData to render the latest table model.
      setFetchedData(latestData);
      console.log('inside useEffect');
    }
  }, []);

  /* useEffect2:
  Updates sessionStorage with current "fetchedData"
  Gets triggered on landing of the page and when table editting is done (updating "fetchedData")
  */
  useEffect(() => {
    // This logic ensures sessionStorage Query and Data gets updated upon either db connection or sql upload (when data's existing already)
    if (DataStore.store.size > 0 && DataStore.queries.size > 0) {
      sessionStorage.Query = JSON.stringify(Array.from(DataStore.queries.entries()));
      sessionStorage.Data = JSON.stringify(Array.from(DataStore.store.entries()));
    }
  }, [fetchedData]);

  //To export queries
  const exportQueries = () => {
    const ex = [DataStore.exportData().join('\n')];
    const data = new Blob(ex, {
      type: 'text/plain;charset=utf-8',
      endings: 'native',
    });
    FileSaver.saveAs(data, 'ExportQueries.sql');
  };

  let queries: any;
  if (DataStore.queries.size > 0) {
    queries = DataStore.queries.get(DataStore.queries.size - 1);
    queries = queries.map((query: { type: string; query: string }, ind: number) => {
      return <Text key={ind}>{`${query.query}`}</Text>;
    });
  }

  // CREATE LOGIC FOR SQL QUERY GENERATOR WHEN CONNECTED TO DB
  // const obj = JSON.parse(JSON.stringify(DataStore.userDBInfo));
  // const db_type: string = obj.db_type;

  let queryGen: string;
  if (sqlOpen === true) {
    queryGen = 'PostgreSQL';
  } else {
    queryGen = 'MySQL';
  }

  if (schemaStore) {
    createInitialEdges();
    createInitialNodes();
  }

  return (
    <AppShell
      padding="md"
      // header={
      // <DisplayHeader
      //   name={user.name}
      //   picture={user.picture}
      //   menuPopUpOpened={menuPopUpOpened}
      //   setMenuPopUpOpened={setMenuPopUpOpened}
      //   setUser={setUser}
      // />
      // }
      navbar={
        <FeatureTab
          setSideBarOpened={setSideBarOpened}
          setTablename={setTablename}
          setFetchedData={setFetchedData}
          fetchedData={fetchedData}
        ></FeatureTab>
      }
      styles={(theme) => ({
        root: { height: '100%' },
        body: { height: '100%' },
        main: {},
      })}
    >
      <Collapse in={logOpened}>
        <ScrollArea
          style={{
            height: 500,
            width: 500,
            backgroundColor: 'white',
            borderRadius: '5px',
            border: '2px solid #2b3a42',
            padding: '5px',
          }}
          type="always"
        >
          <Text sx={{ fontSize: '20px', paddingLeft: '10px' }}>
            {' '}
            {queryGen} Log Settings
          </Text>
          <hr style={{ margin: '5px' }} />
          <Text sx={{ paddingLeft: '10px' }}>{logDisplay}</Text>
        </ScrollArea>
      </Collapse>
      <span>
        <Button
          className="logging"
          styles={(theme: any) => ({
            root: {
              backgroundColor: '#3c4e58',
              border: 0,
              height: 42,
              paddingLeft: 20,
              paddingRight: 20,
              marginBottom: 20,

              '&:hover': {
                backgroundColor: theme.fn.darken('#2b3a42', 0.1),
              },
            },
          })}
          onClick={() => openLogs()}
        >
          Logs
        </Button>
        <input
          type="submit"
          form="logSettingsForm"
          value="Update"
          id="updateLog"
          className="logging"
          style={{ display: buttonVisability }}
        />
      </span>
      <Sidebar
        sideBarOpened={sideBarOpened}
        setSideBarOpened={setSideBarOpened}
        isLoadingProps={isLoading}
        isErrorProps={isError}
        mutate={mutate}
      />
      {DataStore.loadedFile && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'end',
            flexDirection: 'column',
          }}
        >
          <Button
            styles={(theme: any) => ({
              root: {
                backgroundColor: '#3c4e58',
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,
                marginBottom: 20,

                '&:hover': {
                  backgroundColor: theme.fn.darken('#2b3a42', 0.1),
                },
              },
            })}
            onClick={() => setSqlOpen((o) => !o)}
          >
            {sqlOpen ? 'PostgreSQL' : 'MySQL'}
          </Button>
          <Button
            styles={(theme) => ({
              root: {
                backgroundColor: '#3c4e58',
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,

                '&:hover': {
                  backgroundColor: theme.fn.darken('#2b3a42', 0.1),
                },
              },
            })}
            onClick={() => setQueryOpen((o) => !o)}
          >
            {queryOpened ? 'Hide Queries' : 'Show Queries'}
          </Button>

          <Collapse in={queryOpened}>
            <ScrollArea
              style={{
                height: 250,
                width: 500,
                backgroundColor: 'white',
                borderRadius: '5px',
                border: '2px solid #2b3a42',
                padding: '5px',
              }}
              type="always"
            >
              <Text sx={{ fontSize: '20px', paddingLeft: '10px' }}>
                {' '}
                {queryGen} Query Generator
              </Text>
              <hr style={{ margin: '5px' }} />
              <Text sx={{ paddingLeft: '10px' }}>{queries}</Text>
            </ScrollArea>
          </Collapse>
          <Button
            styles={(theme: any) => ({
              root: {
                backgroundColor: '#3c4e58',
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 20,

                '&:hover': {
                  backgroundColor: theme.fn.darken('#2b3a42', 0.1),
                },
              },
            })}
            onClick={() => {
              console.log('run export');
              exportQueries();
            }}
          >
            Export Queries
          </Button>
          <br />
        </Box>
      )}
      {schemaStore ? <Flow /> : <></>}
    </AppShell>
  );
}
