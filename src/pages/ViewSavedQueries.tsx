//* this will be coming from the sidebar(FeatureTab), Test Tab
import React from 'react';
import { useEffect, useState } from 'react';
import FeatureTab from '../components/DBDisplay/FeatureTab';
import { useNavStore } from '../store/navStore';
import axios from 'axios';

// db selecting from prev connected by user
type Database = {
  name: string;
  id: string | number;
};

// defining type of query result
type QueryResult = string[];

// updating state to disaplay multiple queries
type SaveQuery = {
  queryName: string;
  queryString: string;
  dateRun: string;
  execTime: number;
};

const ViewSavedQueries: React.FC = () => {
  //
  // get state of FeatureTab from Zustand store
  const toggleClicked = useNavStore((state) => state.toggleClicked);

  //------------------- TO DELETE, for testing table rendering
  // const [queryResult, setQueryResult] = useState<QueryResult | null>([
  //   'Date Run: April 1, 2025',
  //   'Execution Time: 0.043',
  // ]);
  // const [queryName, setQueryName] = useState<string>('Testing');
  // const [queryString, setQueryString] = useState<string>('SELECT _id FROM people');
  //---------------------------------

  // holds saved Queries
  const [savedQueries, setSavedQueries] = useState<SaveQuery[]>([]);

  // fetch queries data req
  useEffect(() => {
    const fetchSavedQueries = async () => {
      try {
        //
        const { data } = await axios.get(''); // where is req going to in the be??

        setSavedQueries(data); // must update our state
      } catch (error) {
        console.error('Error fetching saved queries:', error);
      }
    };
    fetchSavedQueries();
    // runs on load, empty arr -> no reruns
  }, []);

  return (
    <>
      <div className="justify-space-around flex-auto justify-end border-2 border-black pr-2">
        <FeatureTab />
        <div className="ml-20 pt-20 text-center">
          <h1 className="mb-12 text-5xl font-bold tracking-tight text-yellow-400 md:text-6xl xl:text-7xl">
            Viewing Saved Queries
          </h1>
        </div>
        <div
          className={`transition-all duration-300 ${toggleClicked ? 'ml-16' : 'ml-64'}`}
        >
          {/* this wrap aligns the title 'Queries Saved w/ the table  together */}
          <div className="mt-4 flex gap-x-8">
            {savedQueries.length > 0 && (
              <div className="mt-8 text-white">
                <h3 className="mb-4 text-xl font-semibold">Queries:</h3>
                <table className="mx-auto w-fit table-fixed border-collapse border border-white">
                  <thead>
                    <tr className="bg-blue-950 ">
                      <th className="w-[250px] border border-white px-6 py-3 text-center text-xl text-white">
                        Name
                      </th>
                      <th className="w-[300px] border border-white px-6 py-3 text-center text-xl text-white">
                        Query
                      </th>
                      <th className="w-[250px] border border-white px-6 py-3  text-center text-xl text-white">
                        Date Run
                      </th>
                      <th className="w-[250px] border border-white px-6 py-3  text-center text-xl text-white">
                        Execution Time
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* values from savedQueries */}
                    {savedQueries.map((query, index) => (
                      <tr key={index}>
                        <td className="border border-white px-6 py-3 text-center text-xl text-white">
                          {query.queryName}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-xl text-white">
                          {query.queryString}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-xl text-white">
                          {query.dateRun}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-xl text-white">
                          {query.execTime}s
                        </td>
                      </tr>
                    ))}
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

export default ViewSavedQueries;
