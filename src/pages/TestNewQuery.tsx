//* this will be coming from the Sidebar, Test Tab
import React from 'react';
import { useEffect, useState } from 'react';

// db selecting from prev connected by user
type Database = {
  name: string;
  id: string | number;
};

// defining type of query result
type QueryResult = any;

const TestNewQuery: React.FC = () => {
  // holds the user's query input
  const [textInput, setTextInput] = useState<string>('');
  // holds the selected / connected db
  const [dbInput, setDbInput] = useState<Database | null>(null);
  // holds the result of the query after post req
  const [queryResult, setQueryResult] = useState<QueryResult | null>(null);

  // getting req to query / select db user is using
  useEffect(() => {
    const fetchUserDatabase = async () => {
      try {
        //TODO whats the backend route??
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
        setDbInput({ id: 12345, name: 'Fake Db Name' });
        console.error('Failed to fetch user database', error);
      }
    };
    fetchUserDatabase();
  }, []); // leave empty dependency array to run once on mount

  // post req to send query & db to the back for execution
  const sendQuery = async () => {
    try {
      // conditional to prevent missing input
      if (!textInput || !dbInput) {
        alert('Please enter a query and make sure a database is connected');
        return;
      }

      // post req
      //TODO where is it getting sent to??
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: textInput,
          databaseId: dbInput.id,
        }),
      });

      // conditional for failed resp
      if (!response.ok) {
        throw new Error('HTTP error! status: ${response.status}');
      }

      // parsing and saving the resp (query result)
      const result = await response.json();
      // updates state
      setQueryResult(result);
    } catch (error) {
      console.error('Failed to run query', error);
      setQueryResult({ error: 'Something went wrong with running the query' });
    }
  };

  // post req to save query
  const saveQuery = async () => {
    try {
      // conditional to check that a query was run and that it had results
      if (!queryResult || !dbInput) {
        alert('Please ensure you have ran a query and you received results');
        return;
      }

      // post req
      //TODO where is it getting sent to??
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: textInput,
          databaseId: dbInput.id,
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
      if (!queryResult || !dbInput) {
        alert('Coming Soon!');
        return;
      }

      // post req
      //TODO where is it getting sent to??
      const response = await fetch('', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: textInput,
          databaseId: dbInput.id,
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

  return (
    <div>
      <div className="text-center">
        <h1 className="mb-12 text-5xl font-bold tracking-tight md:text-6xl xl:text-7xl">
          <span className="text-yellow-600">Test New Query Page</span> <br />
          <span className="text-blue-600">TBD</span>
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
      {/* turnery to serve as placeholder for the time between db being fetech and db being rendered */}
      {dbInput ? (
        <span className="text-white-200">Connected to: {dbInput.name}</span>
      ) : (
        <p>Loading database...</p>
      )}
      {/* 💙💙 Query Input ------------- */}
      <div style={{ marginTop: '1rem' }}>
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          rows={2}
          placeholder="Write your SQL query here"
          style={{ width: '100%', padding: '0.5rem' }}
        />
        {/* this wrap aligns the 2 buttons together */}
        <div className="mt-4 flex gap-x-8">
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
