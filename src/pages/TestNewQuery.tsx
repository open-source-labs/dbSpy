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

// defining type of query result (for initial metrics)
type QueryResult = string[];

// defining type of moreMetrics result (for extended metrics)
type MoreMetricsResult = {
  planningTime: number;
  totalCost: number;
  actualTotalTime: number;
  nodeType: string;
  relationName: string;
  planRows: number;
  actualRows: number;
  sharedHit: number;
  sharedRead: number;
};

const TestNewQuery: React.FC = () => {
  // Zustand store to track FeatureTab toggle state
  const toggleClicked = useNavStore((state) => state.toggleClicked);
  // holds the list of dbs user can select from
  const [dbInput, setDbInput] = useState<Database[] | null>(null);
  // holds the user's query input
  const [queryString, setQueryString] = useState<string>('');
  // holds the query name input from user
  const [queryName, setQueryName] = useState<string>('');
  // holds the selected db which will be from an arr of all saved dbs from user
  const [selectedDb, setSelectedDb] = useState<Database | null>(null);
  // holds the result of the query after post req
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);
  // holds the result of other query metrics after post req
  const [moreMetrics, setMoreMetrics] = useState<MoreMetricsResult | null>(null);
  // holds database link to test query on
  const [databaseLink, setDatabaseLink] = useState<string>('');
  // holds saved queries
  const [isQuerySaved, setIsQuerySaved] = useState<boolean>(false);
  // holds error state
  const [error, setError] = useState<string | null>(null);

  // sets state of db credentials to allow connection on BE
  // Zustand function to update global DB credentials store after parsing the input URI
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
    queryName?: string;
  }>({ db_type: 'postgres' });
  //END: STATE DECLARATION

  // Send DB link and query string to BE for testing
  const sendQuery = async () => {
    // reset states
    setIsQuerySaved(false);
    setError(null);
    setQueryResult(null);
    setMoreMetrics(null);
    try {
      // Define params to be sent to BE
      const values: any = dbValues;
      // Break down DB link into relevant elements for BE to read
      if (databaseLink) {
        const fullLink = databaseLink;
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
            values.queryString = queryString;
            values.queryName = queryName;
            break;
          default:
            const postgresName = splitURI[3];
            const postgresPort = splitURI[2].split(':')[2];
            const internalLinkArray_Postgres = splitURI[2].split(':')[1].split('@');
            values.hostname = internalLinkArray_Postgres[1];
            values.username = splitURI[2].split(':')[0];
            values.password = internalLinkArray_Postgres[0];
            values.port = postgresPort ? postgresPort : '5432';
            values.database_name = postgresName;
            values.db_type = 'postgres';
            values.queryString = queryString;
            values.queryName = queryName;
            break;
        }
      }

      // View values array
      // console.log('VALUES FROM testNewQuery FE: ', values);

      // Update DB credential store with values from passed in link
      setDbCredentials(values);
      // set values to use in save query function
      setDbValues(values);

      const dataFromBackend = await axios
        .get(`/api/sql/${values.db_type}/run-query`, { params: values })
        .then((res) => {
          // set query result state with data from response (array)
          // and set more metrics array of objects state
          setQueryResult(res.data.metrics);
          setMoreMetrics(res.data.otherMetrics[0]);
          // clears errors on success
          setError(null);
          setQueryName('');
          setQueryString('');
          setDatabaseLink('');
        })
        .catch((err: ErrorEvent) => {
          console.error('Run query error', err);
          setError(err.error || 'Failed to run query');
        });
    } catch (error) {
      console.error('sendQuery Error: Failed to test query', error);
      setError('An unexpected error occurred while running the query.');
    }
  };

  // send POSt req to BE to save query to user's saved queries
  const saveQuery = async () => {
    // console.log('Testing In Save Query ⭐️');
    try {
      // TODO remove commented out if not used selectedDb later
      // conditional to check that a query was run and that it had results
      if (!queryResult) {
        alert('Please ensure you have ran a query and you received results');
        return;
      }
      // console.log('Testing After If ⭐️');

      // the BE returns back formatted query results
      // we want to extract just the data portion and send to the BE to save the query - since it's in str format, convert to obj
      const extractedQueryRes = {
        queryString: queryResult[1].split(': ')[1],
        query_date: queryResult[2].split(': ')[1],
        exec_time: parseFloat(queryResult[3].split(': ')[1]),
      };

      const savingQuery = await axios
        .post(`/api/sql/${dbValues.db_type}/save-query`, {
          params: { dbValues, extractedQueryRes, moreMetrics },
          headers: {
            'Content-Type': 'application/json',
          },
        })
        .then((res) => {
          // console.log('Query saved successfully! ', res.data);
          return res.data;
        })
        .catch((err: ErrorEvent) => console.error('Save query error', err));
      setIsQuerySaved(true);
    } catch (error) {
      console.error('Failed to save query results', error);
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
    } catch (error) {}
  };

  //TODO get the FeatureTab to not sit on top of content in the page
  return (
    <>
      <div className="min-h-screen flex-auto justify-end justify-around bg-background dark:bg-primary ">
        <FeatureTab />
        {/* Must wrap the page title in the toggle div in order for the title to shift w/ the rest of the page */}
        <div
          className={`transition-all duration-300 ${toggleClicked ? 'ml-16' : 'ml-64'}`}
        >
          <div className="mb-12 mr-2 flex w-full items-center justify-end pt-20">
            <div className="flex w-full">
              <h1 className="text-5xl font-bold tracking-tight text-slate-700 dark:text-accentText">
                Test New Query
              </h1>
            </div>
            {/* -------------Improve w/ AI Button -------------- */}
            <button
              onClick={improveWithAi}
              className="mr-6 h-11 w-auto whitespace-nowrap rounded border-2 border-slate-700 bg-white px-4 py-2 text-black transition duration-200 hover:translate-y-[-2px] hover:cursor-pointer hover:border-sky-700 hover:ring-2 hover:ring-blue-300 dark:bg-blue-100"
            >
              Improve with AI
            </button>
          </div>
          {/* ------------------ Naming Query ------------- */}
          <div className="ml-2 mr-2 mt-4 flex flex-col space-y-4">
            <textarea
              value={queryName}
              onChange={(e) => setQueryName(e.target.value)}
              rows={1}
              placeholder="Name your query"
              className="w-1/2 rounded-md border border-gray-300 p-4 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <textarea
              value={databaseLink}
              onChange={(e) => setDatabaseLink(e.target.value)}
              rows={1}
              placeholder="Enter DB link here"
              className="w-1/2 rounded-md border border-gray-300 p-4 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* ---------------- Query Input ------------- */}
            <textarea
              value={queryString}
              onChange={(e) => setQueryString(e.target.value)}
              rows={1}
              placeholder="Write your SQL query here"
              className="w-1/2 rounded-md border border-gray-300 p-4 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {/* this wrap aligns the 2 buttons together */}
            <div className="mt-4 flex justify-end gap-x-8">
              {/* --------------- Run Query Button -------------- */}
              <button
                onClick={sendQuery}
                className="mr-4 h-11 w-auto whitespace-nowrap rounded border-2 border-slate-700 bg-white px-4 py-2 text-black transition duration-200 hover:translate-y-[-2px] hover:cursor-pointer hover:border-sky-700 hover:ring-2 hover:ring-blue-300 dark:bg-blue-100"
              >
                Run Query
              </button>
              {/* ---------------- Save Query Button -------------- */}
              <button
                onClick={saveQuery}
                className="mr-4 h-11 w-auto whitespace-nowrap rounded border-2 border-slate-700 bg-white px-4 py-2 text-black transition duration-200 hover:translate-y-[-2px] hover:cursor-pointer hover:border-sky-700 hover:ring-2 hover:ring-blue-300 dark:bg-blue-100"
              >
                Save Query
              </button>
            </div>
          </div>
          {/* ------------------ Query Result --------------- */}
          {/* this wrap aligns the title 'Query Results' w/ the table  together */}
          <div className="mt-4 flex gap-x-8">
            {error && (
              <div className="mt-8 text-white">
                Error running query. Check DB link and/or SQL query.
              </div>
            )}
            {queryResult && (
              <div className="overflow-x w-full max-w-[1300px] shrink-0 text-xl font-semibold text-accent dark:text-accentText">
                {isQuerySaved ? 'Query Saved!' : ''}
                <h3 className="mb-4 text-xl font-semibold text-slate-700 dark:text-white">
                  Query Results:
                </h3>
                {/* <table className="mx-auto mr-2 w-fit border-collapse border border-white"> */}
                <table className="mr-2 w-fit border-collapse border border-white">
                  <thead>
                    <tr className="bg-slate-600 dark:bg-slate-700">
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Name
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Query
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Date Run
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Execution Time
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Planning Time
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Total Cost
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Actual Total Time
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Node Type
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Relation Name
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Plan Rows
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Actual Rows
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Shared Hit Blocks
                      </th>
                      <th className="border border-white px-6 py-3 text-center text-base text-white">
                        Shared Read Blocks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {/* dynamically extracting values from queryResult */}
                      {queryResult.map((metric, index) => {
                        const [, value] = (metric as string).split(':');
                        return (
                          <td
                            key={index}
                            className="border border-slate-700 px-4 py-2 text-center text-base text-slate-800 dark:border-white dark:text-white"
                          >
                            {value.trim()}
                          </td>
                        );
                      })}
                      {/* Body of extended metrics (moreMetrics) */}
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.planningTime
                          ? moreMetrics.planningTime + 'ms'
                          : 'N/A'}
                      </td>
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.totalCost}
                      </td>
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.actualTotalTime}
                      </td>
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.nodeType}
                      </td>
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.relationName}
                      </td>
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.planRows}
                      </td>
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.actualRows}
                      </td>
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.sharedHit ? moreMetrics.sharedHit : 'N/A'}
                      </td>
                      <td className="border border-slate-700 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                        {moreMetrics?.sharedRead ? moreMetrics?.sharedRead : 'N/A'}
                      </td>
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
