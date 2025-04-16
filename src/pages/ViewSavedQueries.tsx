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

// updating state to display multiple queries
type SaveQuery = {
  name: string;
  query: string;
  query_date: string;
  exec_time: number;
  planning_time: number;
  total_cost: number;
  actual_total_time: number;
  node_type: string;
  relation_name: string;
  plan_rows: number;
  actual_rows: number;
  shared_hit_blocks: number;
  shared_read_blocks: number;
};

const ViewSavedQueries: React.FC = () => {
  // get state of FeatureTab from Zustand store
  const toggleClicked = useNavStore((state) => state.toggleClicked);

  // holds saved Queries
  const [savedQueries, setSavedQueries] = useState<SaveQuery[]>([]);

  // fetch queries data req
  useEffect(() => {
    const fetchSavedQueries = async () => {
      try {
        const res = await axios.get(`/api/saveFiles/saved-queries`);
        // console.log('response from BE: ', res.data[0]);
        setSavedQueries(res.data[0]); // update state with data from BE
      } catch (error) {
        console.error('Error fetching saved queries:', error);
      }
    };
    fetchSavedQueries();
    // runs on load, empty arr -> ensures fetch runs only once when the component mounts
  }, []);

  return (
    <>
      <div className="flex-auto justify-end justify-around bg-background pr-2 dark:bg-primary">
        <FeatureTab />
        <div
          className={`h-screen transition-all duration-300 ${
            toggleClicked ? 'ml-16' : 'ml-64'
          }`}
        >
          <h1 className="flex items-center justify-center pt-20 text-5xl font-bold tracking-tight text-slate-700 dark:text-accentText">
            Saved Queries
          </h1>
          {/* this wrap aligns the title 'Saved Queries w/ the table together */}
          <div className="mt-4 flex gap-x-8">
            {savedQueries.length > 0 ? (
              <div className="mt-8 w-full max-w-[1300px] shrink-0 overflow-x-auto px-4 text-white">
                <table className="min-w-full table-fixed border-collapse border border-white text-white">
                  <thead>
                    <tr className="bg-slate-600 dark:bg-slate-700 ">
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Name
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Query
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Date Run
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Execution Time
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Planning Time
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Total Cost
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Actual Total Time
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Node Type
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Relation Name
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Plan Rows
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Actual Rows
                      </th>
                      <th className="w-[400px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Shared Hit Blocks
                      </th>
                      <th className="w-[250px] whitespace-normal text-wrap break-words border border-white px-6 py-3 text-center text-lg text-white">
                        Shared Read Blocks
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* values from savedQueries to get us each row */}
                    {savedQueries.map((query, index) => (
                      <tr key={index}>
                        <td className="break-words border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.name}
                        </td>
                        <td className="break-words border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.query}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {new Date(query.query_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.exec_time}ms
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.planning_time ? query.planning_time + 'ms' : 'N/A'}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.total_cost}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.actual_total_time}ms
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.node_type}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.relation_name}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.plan_rows}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.actual_rows}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.shared_hit_blocks ? query.shared_hit_blocks : 'N/A'}
                        </td>
                        <td className="border border-slate-500 px-6 py-3 text-center text-base text-slate-800 dark:border-white dark:text-white">
                          {query.shared_read_blocks ? query.shared_hit_blocks : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center text-lg text-slate-800 dark:text-white">
                No Queries Saved
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewSavedQueries;
