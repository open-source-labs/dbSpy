// React & React Router & React Query Modules;
import React, { useState, useEffect, useCallback } from 'react';

import { useMutation } from 'react-query';

//Components imported;
import Table from './Table';
import useCredentialsStore from '../../store/credentialsStore';

// UI & Visualization Libraries
import axios from 'axios';
import DataStore from '../../Store';
import Xarrow, { useXarrow, Xwrapper } from 'react-xarrows';
import Draggable from 'react-draggable';
import { DatabaseImport, DatabaseOff } from 'tabler-icons-react';
import { Loader, Text, Button, Group } from '@mantine/core';

// React Flow Libraries
import ReactFlow, {
  addEdge,
  FitViewOptions,
  applyNodeChanges,
  applyEdgeChanges,
  Node,
  Edge,
  NodeChange,
  EdgeChange,
  Connection,
  Controls
} from 'reactflow';

import TableFlow from './TableFlow';

const initialNodes: Node[] = [
  { id: '1', type: 'tableFlow', data: { label: 'Node 1' }, position: { x: 5, y: 5 } },
  { id: '2', data: { label: 'Node 2' }, position: { x: 5, y: 100 } },
];

const initialEdges: Edge[] = [{ id: 'e1-2', source: '1', target: '2' }];

const fitViewOptions: FitViewOptions = {
  padding: 0.2,
};

const nodeTypes = {tableFlow: TableFlow};

// function Flow() {
//   const [nodes, setNodes] = useState<Node[]>(initialNodes);
//   const [edges, setEdges] = useState<Edge[]>(initialEdges);

//   const onNodesChange = useCallback(
//     (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
//     [setNodes]
//   );
//   const onEdgesChange = useCallback(
//     (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
//     [setEdges]
//   );
//   const onConnect = useCallback(
//     (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
//     [setEdges]
//   );

//   return (
//     <ReactFlow
//       nodes={nodes}
//       edges={edges}
//       onNodesChange={onNodesChange}
//       onEdgesChange={onEdgesChange}
//       onConnect={onConnect}
//       fitView
//       fitViewOptions={fitViewOptions}
//       nodeTypes={nodeTypes}
//     />
//   );
// }

type Props = {
  isActive: boolean;
  setIsActive: (active: boolean) => void;
};
interface CanvasProps {
  fetchedData: {
    [key: string]: {
      [key: string]: {
        IsForeignKey: boolean;
        IsPrimaryKey: boolean;
        Name: string;
        References: any[];
        TableName: string;
        Value: any;
        additional_constraints: string | null;
        data_type: string;
        field_name: string;
      };
    };
  };
  tableId?: any;
  isLoadingProps: boolean;
  isErrorProps: boolean;
  setFetchedData: (fetchedData: object) => void;
  setSideBarOpened: (param: boolean) => void;
  reference: any;
  setSqlOpen: (sqlOpen: boolean) => void;
  sqlOpen: boolean;
}

/** Canvas Component - a canvas section where Tables being generated */
export default function Canvas({
  isLoadingProps,
  isErrorProps,
  fetchedData,
  setFetchedData,
  reference,
  setSqlOpen,
  sqlOpen,
}: CanvasProps) {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION


  /** useMutation for handling 'POST' request to '/api/handleQueries' route for executing series of queries for DB migration; 
  onSuccess: Once queries get complete, it will clear out the sessionStorage and render the latestTableModel confirming the success of migration
  */

  //setting state for the setId
  const [tableId, setId] = useState('');

  const { isLoading, isError, mutate } = useMutation(
    (dbQuery: object) => {
      return axios.post('/api/handleQueries', dbQuery).then((res) => {});
    },
    {
      onSuccess: () => {
        //Upon success of query execution, we will store the latest Table Model from DataStore into a variable named "lastestTableModel".
        const latestTableModel: any = DataStore.getData(
          DataStore.store.size - 1
        );
        //Then, we clear DataStore (global state that gets reset after refresh) and set the initial Table Model with latestTableModel and emtpy query.
        DataStore.clearStore();
        DataStore.setQuery([{ type: '', query: '' }]);
        DataStore.setData(latestTableModel);

        //Update sessionStorage Data and Query with recently updated DataStore.
        sessionStorage.Data = JSON.stringify(
          Array.from(DataStore.store.entries())
        );
        sessionStorage.Query = JSON.stringify(
          Array.from(DataStore.queries.entries())
        );

        //Update the rendering of the tables with latest table model.
        setFetchedData(latestTableModel);
      },
      onError: () => {
        //Upon error, alert the user with error message
        alert('Failed to execute changes');
      },
    }
  );

  /** "executeChanges" - a function that gets invoked when Execute button is clicked and trigger useMutation for POST request;
   *  Grabs the URI data and queries from global state "DataStore" and pass it into mutate method;
   */
  const executeChanges = () => {
    const obj = JSON.parse(JSON.stringify(DataStore.userDBInfo));

    // creating URI for server to connect to user's db
    let db_uri =
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

    // uri examples
    // DATABASE_URL=postgres://{user}:{password}@{hostname}:{port}/{database-name}
    // "postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName";
    const dbQuery = {
      queries: DataStore.getQuery(DataStore.queries.size - 1),
      uri: db_uri,
    };
    mutate(dbQuery);
  };

  const flows = function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState<Edge[]>(initialEdges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [setEdges]
  );
  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      fitView
      fitViewOptions={fitViewOptions}
      nodeTypes={nodeTypes}
    />
  );
}




  /** "tables" is an array with Table components generated by iterating fetchedData */
  const tables: JSX.Element[] = Object.keys(fetchedData).map(
    (tablename: any, ind: number) => {
      return (
        <Table
          z-index={1}
          setId={setId}
          key={`Table${ind}`}
          id={tablename}
          setSqlOpen={setSqlOpen}
          sqlOpen={sqlOpen}
          tableInfo={fetchedData[tablename]}
          setFetchedData={setFetchedData}
          fetchedData={fetchedData}
        />
      );
    }
  );

  /** "refArray" is an array of Reference object where IsDestination is true */
  let refArray: string[] = [];
  for (let table in fetchedData) {
    for (let column in fetchedData[table]) {
      for (let ref in fetchedData[table][column].References) {
        if (fetchedData[table][column].References[ref].IsDestination == false)
          refArray.push(fetchedData[table][column].References[ref]);
      }
    }
  }

  /** xa are grey arrows that show the connections between the tables */
  const xa: JSX.Element[] | any = refArray.map((reff: any, ind: number) => {
    let greyTrue = true;
    if (reff.ReferencesTableName === tableId) {
      greyTrue = false;
    }
    return (
      <Xarrow
        key={ind}
        headSize={5}
        zIndex={0}
        color={'grey'}
        showXarrow={greyTrue}
        start={reff.ReferencesTableName}
        end={reff.PrimaryKeyTableName}
        endAnchor={[
          { position: 'right', offset: { x: +10, y: +10 } },
          { position: 'left', offset: { x: -10, y: -10 } },
          { position: 'bottom', offset: { x: +10, y: +10 } },
          { position: 'top', offset: { x: -10 } },
        ]}
        curveness={1.0}
        animateDrawing={2}
      />
    );
  });

  /** xarrows are the blue arrows that show the table connections when clicked on */
  const xarrows: JSX.Element[] = refArray.map((reff: any, ind: number) => {
    let blueTrue = false;
    if (reff.ReferencesTableName === tableId) {
      blueTrue = true;
    }
    return (
      <Xarrow
        key={ind}
        path="smooth"
        headSize={4}
        zIndex={0}
        color={'blue'}
        showXarrow={blueTrue}
        start={reff.ReferencesTableName}
        end={reff.PrimaryKeyTableName}
        dashness={true}
        curveness={1.0}
        animateDrawing={true}
      />
    );
  });

  /** Truthy when the user is connecting to the database to grab the intial table model */
  if (isLoadingProps) {
    return (
      <div className="canvas-LoadingProps">
        Please wait while we process your request.
        <br />
        <br />
        <Loader size="xl" variant="dots" />
      </div>
    );
  }

  /** Truthy when the user has an issue grabbing the inital table model */
  if (isErrorProps) {
    return (
      <div className="canvas-ErrorProps">
        An error occurred while we processed your request. Please check your
        connection.
      </div>
    );
  }

  /** Truthy when the user is executing the queries for database migration */
  if (isLoading) {
    return (
      <div className="canvas-Loading">
        Please wait while we process your request.
        <br />
        <Loader size="xl" variant="dots" />
      </div>
    );
  }

  /** Truthy when the user fails to execute the queries for database migration */
  if (isError) {
    return (
      <div className="canvas-IsError">
        An error occurred while we processed your request. Please check your
        connection.
      </div>
    );
  }

  const dbButtons = (
    <div className="dbButtons">
      <Group position="right">
        <Button
          styles={(theme) => ({
            root: {
              height: 42,
              paddingLeft: 20,
              paddingRight: 20,
              marginRight: 40,
              '&:hover': {
                backgroundColor: theme.fn.darken('#3c4e58', 0.1),
                color: 'white',
              },
            },
          })}
          id="disconnectButton"
          variant="outline"
          color="dark"
          size="md"
          compact
          leftIcon={<DatabaseOff />}
          onClick={() => {
            sessionStorage.clear();
            DataStore.disconnect();
          }}
        >
          Disconnect database
        </Button>
      </Group>
      <Group position="right">
        <Button
          styles={(theme) => ({
            root: {
              backgroundColor: '#3c4e58',
              color: 'white',
              border: 0,
              height: 42,
              paddingLeft: 20,
              paddingRight: 20,
              marginTop: 1,

              '&:hover': {
                backgroundColor: theme.fn.darken('#2b3a42', 0.1),
              },
            },
          })}
          id="executeButton"
          size="md"
          compact
          leftIcon={<DatabaseImport />}
          onClick={() => executeChanges()}
        >
          Execute changes
        </Button>
      </Group>
    </div>
  );

  return (
    <div ref={reference}>

      {Object.keys(fetchedData).length > 0 && DataStore.connectedToDB ? (
        <>
          {flows}
          {dbButtons}
          <div className="canvas-Line311">
            <Xwrapper>
              {tables}
              {xa}
              {xarrows}
            </Xwrapper>
          </div>
        </>
      ) : Object.keys(fetchedData).length > 0 && DataStore.loadedFile ? (
        <>
         {flows}
          <div className="canvas-Line360">
            <Xwrapper>
              {tables}
              {xa}
            </Xwrapper>
          </div>
        </>
      ) : (
        <>
          <div className="canvas-ConnectToDatabase">
            <h3>Welcome to dbSpy!</h3>
            Please connect your database, upload a SQL file, or build your
            database from scratch!
          </div>
          {flows}
        </>
      )}
    </div>
  );
}
