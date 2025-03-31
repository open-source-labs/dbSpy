//* this will be coming from the sidebar (FeatureTab)
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import { NavLink } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';

// db selecting from prev connected by user
type Database = {
  name: string;
  id: string | number;
};

// defining type of query result
type QueryResult = any;

const TestNewQuery: React.FC = () => {
  // holds the list of dbs user can select from
  const [dbInput, setDbInput] = useState<Database[] | null>(null);
  // holds the user's query input
  const [textInput, setTextInput] = useState<string>('');
  // holds the selected db which will be from an arr of all saved dbs from user
  const [selectedDb, setSelectedDb] = useState<Database | null>(null);
  // holds the result of the query after post req
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  // TEMPORARY USE STATE FOR DB TEST LINK
  const [databaseLink, setDatabaseLink] = useState<string>('');
  // const [dbTextInput, setDbTextInput] = useState<string>('');
  const setDbCredentials = useCredentialsStore((state) => state.setDbCredentials);

  //form state hooks
  const [dbValues, setDbValues] = useState<{
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

  // getting req to query / select db user is using
  useEffect(() => {
    const fetchUserDatabase = async () => {
      try {
        //TODO where is it getting sent to?? backend route??
        const response = await fetch('');
        if (!response.ok) {
          throw new Error('HTTP error! status: ${response.status}');
        }
        // parsing the json data
        const data = await response.json();

        // saving data to state
        setDbInput(data);
      } catch (error) {
        // TODO DELETE when backend works
        // fake data to test calling state w/ successful api call
        setDbInput([{ id: 12345, name: 'Fake Db Name' }]);
        console.error('Failed to fetch user database', error);
      }
    };
    fetchUserDatabase();
  }, []); // leave empty dependency array to run once on mount

  // post req to send query & db to the back for execution
  const sendQuery = async () => {
    try {
      // conditional to prevent missing input
      // if (!textInput || !selectedDb) {
      //   alert('Please enter a query and make sure a database is connected');
      //   return;
      // }

      // post req
      //TODO where is it getting sent to?? backend route??
      // const response = await fetch('', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     query: textInput,
      //     databaseId: selectedDb.id,
      //   }),
      // });

      // TEMPORARY BE TEST EFFICIENCY ROUTE ///////////////////////////////////////////////////////////////////////////////
      const values: any = dbValues;
      if (databaseLink) {
        const fullLink = databaseLink;
        const splitURI = fullLink.split('/');

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
      }

      setDbCredentials(values);
      const dataFromBackend = await axios
        .get(`/api/sql/${values.db_type}/run-query`, { params: values })
        .then((res) => {
          console.log('metrics from BE: ', res);
          return res.data;
        })
        .catch((err: ErrorEvent) => console.error('getSchema error', err));
      // TBD this line
      setQueryResult(dataFromBackend.result);

      // const testResponse = await fetch(
      //   'http://localhost:3000/api/sql/postgres/run-query',
      //   {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       query: textInput,
      //       database_link: databaseLink,
      //     }),
      //   }
      // )
      //   .then((res) => {
      //     if (!res.ok) {
      //       console.log('error');
      //     }
      //     console.log('metrics from BE: ', res);
      //     setQueryResult(res);
      //   })
      //   .catch((err) => {
      //     console.error('Failed to save query results', err);
      //   });
      // END TEMPORARY BE TEST EFFICIENCY ROUTE ///////////////////////////////////////////////////////////////////////////////

      // conditional for failed resp
      // if (!response.ok) {
      //   throw new Error('HTTP error! status: ${response.status}');
      // }

      // parsing and saving the resp (query result)
      // const result = await response.json();
      // updates state
      // setQueryResult(result);
    } catch (error) {
      console.error('Failed to run query', error);
      // setQueryResult({ error: 'Something went wrong with running the query' });
    }
  };

  // post req to save query
  const saveQuery = async () => {
    try {
      // conditional to check that a query was run and that it had results
      if (!queryResult || !selectedDb) {
        alert('Please ensure you have ran a query and you received results');
        return;
      }

      // post req
      //TODO where is it getting sent to?? backend route??
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: textInput,
          databaseId: selectedDb.id,
          result: queryResult,
        }),
      });
      // conditional for failed resp
      if (!response.ok) {
        throw new Error('HTTP error! status: ${response.status}');
      }
    } catch (error) {
      console.error('Failed to save query results', error);
    }
  };

  // post req to Improve w/ AI
  const improveWithAi = async () => {
    try {
      // conditional to check that a query was run and that it had results
      if (!queryResult || !selectedDb) {
        alert('Coming Soon!');
        return;
      }

      // post req
      //TODO where is it getting sent to?? backend route??
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: textInput,
          databaseId: selectedDb.id,
          result: queryResult,
        }),
      });

      // conditional for failed resp
      if (!response.ok) {
        throw new Error('HTTP error! status: ${response.status}');
      }
    } catch (error) {
      console.error('Coming Soon!', error);
    }
  };
  //TODO get the FeatureTab to not sit on top of content in the page
  return (
    <div>
      {/* <FeatureTab></FeatureTab> */}
      <div className="pt-20 text-center">
        <h1 className="mb-12 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
          <span className="text-yellow-400">Test New Query Page</span> <br />
        </h1>
      </div>

      {/* 💙💙 Improve w/ AI Button -------------- */}
      <div className="mr-2 flex justify-end">
        <button
          onClick={improveWithAi}
          className="rounded border border-gray-400 px-4 py-2 text-black hover:bg-gray-100"
        >
          Improve with AI
        </button>
      </div>

      {/* TEMPORARY BE - test db + query */}
      {/* revas link: 
      postgresql://postgres.gcfszuopjvbjtllgmenw:store2025@aws-0-us-east-1.pooler.supabase.com:6543/postgres
      */}
      <textarea
        value={databaseLink}
        onChange={(e) => setDatabaseLink(e.target.value)}
        rows={1}
        placeholder="enter db link here"
        className="w-1/2 rounded-md border border-gray-300 p-4 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      {/* 💙💙 Select db dropdown ------------------- */}
      {dbInput && (
        <div className="my-4">
          <label htmlFor="database-select" className="mr-2">
            Select a Database:
          </label>
          <select
            id="database-select"
            onChange={(e) => {
              const selected = dbInput.find((db) => db.id.toString() === e.target.value);
              setSelectedDb(selected || null);
            }}
            className="rounded border px-3 py-2 text-black"
            value={selectedDb?.id ?? ''}
          >
            <option value="" disabled>
              -- Choose a database --
            </option>
            {dbInput.map((db) => (
              <option key={db.id} value={db.id}>
                {db.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {/* turnery to serve as placeholder for the time between db being fetech and db being rendered */}
      {selectedDb ? (
        <span className="text-white-200">Connected to: {selectedDb.name}</span>
      ) : (
        <p>Loading database...</p>
      )}
      {/* 💙💙 Query Input ------------- */}
      <div className="ml-2 mt-4">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={2}
          placeholder="Write your SQL query here"
          className="w-1/2 rounded-md border border-gray-300 p-4 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {/* this wrap aligns the 2 buttons together */}
        <div className="mt-4 flex justify-end gap-x-8">
          {/* 💙💙 Run Query Button -------------- */}
          <button
            onClick={sendQuery}
            className="rounded border border-gray-400 px-4 py-2 text-black hover:bg-gray-100"
          >
            Run Query
          </button>
          {/* 💙💙 Save Query Button -------------- */}
          <button
            onClick={saveQuery}
            className="rounded border border-gray-400 px-4 py-2 text-black hover:bg-gray-100"
          >
            Save Query
          </button>
        </div>
      </div>
      {/* 💙💙 Query Result --------------- */}
      {queryResult && (
        <div style={{ marginTop: '2rem' }}>
          <h3>Query Result:</h3>
          <pre>{JSON.stringify(queryResult, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestNewQuery;
