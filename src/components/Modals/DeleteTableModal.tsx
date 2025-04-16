import React, { useState, useEffect } from 'react';
import useSchemaStore from '../../store/schemaStore';
import useCredentialsStore from '../../store/credentialsStore';
import useDataStore from '../../store/dataStore';
import useFlowStore from '../../store/flowStore';
import ReactFlow, { getConnectedEdges } from 'reactflow';

type DeleteTableModalProps = {
  closeDeleteTableModal: () => void;
};
let counter: number = 0;
export default function DeleteTableModal({
  closeDeleteTableModal,
}: DeleteTableModalProps) {
  const [tableName, setTableName] = useState<string>('');
  const [tableNames, setTableNames] = useState<string[]>([]);
  const [connectPressed, setConnectPressed] = useState(false);

  const { dbCredentials } = useCredentialsStore((state) => state);
  const { schemaStore, setSchemaStore } = useSchemaStore((state) => state);
  const { dataStore, setDataStore } = useDataStore((state) => state);
  const { setEdges, setNodes } = useFlowStore((state) => state);

  useEffect(() => {
    const fetchTableNames = async () => {
      try {
        const tableNameArr: string[] = [];
        for (const tableName in schemaStore) {
          tableNameArr.push(tableName);
        }
        setTableNames(tableNameArr);
      } catch (error: unknown) {
        console.error('Error retrieving table names from schemaStore:', error);
      }
    };
    fetchTableNames();
  }, []);

  //modified to fix bugs by dbspy 7.0
  const deleteTable = async (): Promise<void> => {
    try {
      setConnectPressed(true);
      for (let tableKey in schemaStore) {
        for (let rowKey in schemaStore[tableKey]) {
          if (
            schemaStore[tableKey][rowKey].IsForeignKey &&
            schemaStore[tableKey][rowKey].References[0].PrimaryKeyTableName === tableName
          ) {
            schemaStore[tableKey][rowKey].IsForeignKey = false;
          }
        }
      }
      const response = await fetch(`/api/sql/${dbCredentials.db_type}/deleteTable`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName: tableName }),
      });

      //delete the table object from the schemaStore object
      delete schemaStore[tableName];
      delete dataStore[tableName];
      setNodes([]);
      setEdges([]);
      //pass in modified schemaStore object which triggers a the rerender function in the flow.tsx component
      setSchemaStore(Object.keys(schemaStore).length > 0 ? { ...schemaStore } : {});
      setDataStore(Object.keys(dataStore).length > 0 ? { ...dataStore } : {});
      setTableName('');
      setConnectPressed(false);
      closeDeleteTableModal();
    } catch (error) {
      console.error('Error fetching table names:', error);
      closeDeleteTableModal();
      setTableName('');
    }
  };
  return (
    <div id="deleteTableModal" className="input-modal">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md"></div>
      <div className="modal-content relative z-10 w-96 rounded-md bg-opacity-80 bg-gradient-to-b from-[#f8f4eb] to-transparent shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:from-accent dark:shadow-[0px_5px_10px_#1e293b]">
        <h2 className="pb-4 text-xl text-slate-900 dark:text-[#f8f4eb]">
          Select a table to delete:
        </h2>
        <ul className="text-slate-900 dark:text-[#f8f4eb]">
          {tableNames.map((name) => (
            <li key={`table-${name}`} className="flex items-center justify-between pb-2">
              {name}{' '}
              <button
                value={name}
                onClick={() => setTableName(name)}
                className="rounded-md bg-red-500 px-2 py-1 text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        {!connectPressed ? (
          <>
            {tableName && (
              <div className="mt-4 text-slate-900 dark:text-[#f8f4eb]">
                <br></br>
                <h3 className="mb-2 flex justify-center">
                  Are you sure you want to delete the {tableName} table?
                </h3>
                <div className="flex justify-center gap-4">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      deleteTable();
                      setTableName('');
                    }}
                    className="rounded-md border-2 border-red-400 bg-red-500 px-2 py-1 text-white hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 dark:text-[#f8f4eb]"
                  >
                    Confirm
                  </button>{' '}
                  <button
                    onClick={() => setTableName('')}
                    className="rounded-md border-2 border-slate-500 px-2 py-1 text-slate-900 hover:opacity-70 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-opacity-50 dark:text-[#f8f4eb]"
                  >
                    Return
                  </button>
                </div>
              </div>
            )}
            <br></br>
            <div className="flex justify-center">
              <button
                type="button"
                className="modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb] "
                onClick={async (e) => {
                  e.preventDefault();
                  setTableNames([]);
                  setTableName('');
                  closeDeleteTableModal();
                }}
                data-testid="modal-cancel"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <div className="flex items-center justify-center">
            <br></br>
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
                <p>Deleting...</p>
                <p>Please wait, this could take a minute</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
