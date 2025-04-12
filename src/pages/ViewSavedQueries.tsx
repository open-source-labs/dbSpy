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
      <div className="justify-space-around flex-auto justify-end border-2 border-black pr-2">
        <FeatureTab />
        <div className="ml-20 pt-20 text-center">
          <h1 className="mb-12 text-5xl font-bold tracking-tight text-yellow-400">
            Saved Queries
          </h1>
        </div>
        <div
          className={`h-screen transition-all duration-300 ${
            toggleClicked ? 'ml-16' : 'ml-64'
          }`}
        >
          {/* this wrap aligns the title 'Queries Saved w/ the table  together */}
          <div className="mt-4 flex gap-x-8">
            {savedQueries.length > 0 && (
              <div className="mt-8 w-full max-w-[1300px] shrink-0 overflow-x-auto px-4 text-white">
                <table className="min-w-full table-fixed border-collapse border border-white text-white">
                  <thead>
                    <tr className="bg-blue-950 ">
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
                        <td className="break-words border border-white px-6 py-3 text-center text-base text-white">
                          {query.name}
                        </td>
                        <td className="break-words border border-white px-6 py-3 text-center text-base text-white">
                          {query.query}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {new Date(query.query_date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.exec_time}ms
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.planning_time ? query.planning_time + 'ms' : 'NULL'}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.total_cost}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.actual_total_time}ms
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.node_type}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.relation_name}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.plan_rows}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.actual_rows}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.shared_hit_blocks ? query.shared_hit_blocks : 'NULL'}
                        </td>
                        <td className="border border-white px-6 py-3 text-center text-base text-white">
                          {query.shared_read_blocks ? query.shared_hit_blocks : 'NULL'}
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
