//* this will be coming from the sidebar (FeatureTab)
import React from 'react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import { NavLink } from 'react-router-dom';
import useCredentialsStore from '../store/credentialsStore';
import { QueryRunnerAlreadyReleasedError } from 'typeorm';

import { useNavStore } from '../store/navStore';

// db selecting from prev connected by user
type Database = {
  name: string;
  id: string | number;
};

// defining type of query result
type QueryResult = string[];

const TestNewQuery: React.FC = () => {
  // get state of FeatureTab from Zustand store
  const toggleClicked = useNavStore((state) => state.toggleClicked);
  // holds the list of dbs user can select from
  const [dbInput, setDbInput] = useState<Database[] | null>(null);
  // holds the user's query input
  const [queryInput, setQueryInput] = useState<string>('');
  // holds the selected db which will be from an arr of all saved dbs from user
  const [selectedDb, setSelectedDb] = useState<Database | null>(null);
  // holds the result of the query after post req
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  // holds database link to test query on
  const [databaseLink, setDatabaseLink] = useState<string>('');

  // sets state of db credentials to allow connection on BE
  // TODO: Review the use of Store in this case
  const setDbCredentials = useCredentialsStore((state) => state.setDbCredentials);

  // State variables / types for DB link elements which sets values object
  // TODO: Review this state declaration: should we be setting a state here?
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
    queryString?: string;
  }>({ db_type: 'postgres' });
  //END: STATE DECLARATION

  // ! Not sure if this useEffect is needed. we aren't loading any data on render
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
    // fetchUserDatabase();
  }, []); // leave empty dependency array to run once on mount

  // Send DB link and query string to BE for testing
  const sendQuery = async () => {
    try {
      // Define params to be sent to BE
      const values: any = dbValues;
      // Break down DB link into relevant elements for BE to read
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
        values.db_type = 'postgres';
        values.queryString = queryInput; // include query string on params
      }

      // View values array
      console.log('VALUES FROM testNewQuery FE: ', values);

      // Update DB credential store with values from passed in link
      setDbCredentials(values);
      const dataFromBackend = await axios
        .get(`/api/sql/${values.db_type}/run-query`, { params: values })
        .then((res) => {
          console.log('response from BE: ', res.data);
          return res.data; // data is an array
        })
        .catch((err: ErrorEvent) => console.error('getSchema error', err));
      // set query result state with data from response (array)
      setQueryResult(dataFromBackend);
      setQueryInput('');
      setDatabaseLink('');
    } catch (error) {
      console.error('sendQuery Error: Failed to test query', error);
    }
  };

  // ! Is saveQuery needed?
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
      // const response = await fetch('', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     query: textInput,
      //     databaseId: selectedDb.id,
      //     result: queryResult,
      //   }),
      // });
      // // conditional for failed resp
      // if (!response.ok) {
      //   throw new Error('HTTP error! status: ${response.status}');
      // }
    } catch (error) {
      //   console.error('Failed to save query results', error);
    }
  };

  // TODO Implement AI
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
      //   const response = await fetch('', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify({
      //       query: textInput,
      //       databaseId: selectedDb.id,
      //       result: queryResult,
      //     }),
      //   });

      //   // conditional for failed resp
      //   if (!response.ok) {
      //     throw new Error('HTTP error! status: ${response.status}');
      //   }
    } catch (error) {
      //   console.error('Coming Soon!', error);
    }
  };

  //TODO get the FeatureTab to not sit on top of content in the page
  return (
    <>
      <div className="justify-space-around flex-auto justify-end border-2 border-black pr-2">
        {/* <FeatureTab></FeatureTab> */}
        <FeatureTab />
        <div className="ml-20 pt-20 text-center">
          <h1 className="mb-12 text-5xl font-bold tracking-tight text-yellow-400 md:text-6xl xl:text-7xl">
            Test New Query
          </h1>
        </div>
        <div
          className={`transition-all duration-300 ${toggleClicked ? 'ml-16' : 'ml-64'}`}
        >
          {/* 💙💙 Improve w/ AI Button -------------- */}
          <div className="mr-2 flex justify-end">
            <button
              onClick={improveWithAi}
              className="rounded border border-gray-400 px-4 py-2 text-black hover:translate-y-[-2px] hover:cursor-pointer dark:bg-blue-100"
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
                  const selected = dbInput.find(
                    (db) => db.id.toString() === e.target.value
                  );
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
            <span className="text-white">Connected to: {selectedDb.name}</span>
          ) : (
            <p className="dark:text-white">Loading database...</p>
          )}
          {/* 💙💙 Query Input ------------- */}
          <div className="ml-2 mt-4">
            <textarea
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              rows={1}
              placeholder="Write your SQL query here"
              className="w-1/2 rounded-md border border-gray-300 p-4 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* this wrap aligns the 2 buttons together */}
            <div className="mt-4 flex justify-end gap-x-8">
              {/* 💙💙 Run Query Button -------------- */}
              <button
                onClick={sendQuery}
                className="rounded border border-gray-400 px-4 py-2 text-black hover:translate-y-[-2px] hover:cursor-pointer dark:bg-blue-100"
              >
                Run Query
              </button>
              {/* 💙💙 Save Query Button -------------- */}
              <button
                onClick={saveQuery}
                className="rounded border border-gray-400 px-4 py-2 text-black hover:translate-y-[-2px] hover:cursor-pointer dark:bg-blue-100"
              >
                Save Query
              </button>
            </div>
          </div>
          {/* 💙💙 Query Result --------------- */}
          {/* To Delete- old rendering of metrics */}
          {/* {queryResult && (
            <div style={{ marginTop: '2rem', color: 'white' }}>
              <h3>Query Result:</h3>
              {queryResult?.map((metric) => (
                <pre>{metric}</pre>
              ))}
            </div>
          )} */}
          {/* this wrap aligns the title 'Query Results' w/ the table  together */}
          <div className="mt-4 flex gap-x-8">
            {queryResult && (
              <div className="mt-8 text-white">
                <h3 className="mb-4 text-xl font-semibold">Query Results:</h3>
                <table className="mx-auto w-fit table-fixed border-collapse border border-white">
                  <thead>
                    <tr className="bg-blue-950 ">
                      <th className="w-[300px] border border-white px-6 py-3 text-center text-xl text-white">
                        Query Name
                      </th>
                      <th className="w-[300px] border border-white px-6 py-3  text-center text-xl text-white">
                        Date Run
                      </th>
                      <th className="w-[300px] border border-white px-6 py-3  text-center text-xl text-white">
                        Execution Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {/* Query Name Goes HERE */}
                      <td className="border border-white px-6 py-4 text-center text-xl text-black dark:text-white">
                        {queryInput}
                      </td>
                      {/* dynamically extracting values from queryResult */}
                      {queryResult.map((metric, index) => {
                        const [, value] = (metric as string).split(':');
                        return (
                          <td
                            key={index}
                            className="border px-4 py-2 text-center text-xl text-black dark:text-white"
                          >
                            {value.trim()}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default TestNewQuery;
