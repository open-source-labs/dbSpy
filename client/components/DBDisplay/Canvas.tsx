import React, { useRef, useState } from "react";
import Table from "./Table";
import Xarrow, { Xwrapper } from "react-xarrows";
import { Loader, Text, Button, Group, Modal } from "@mantine/core";
import { Database, DatabaseImport } from "tabler-icons-react";
import { LinearProgress } from "@mui/material";
import Sidebar from "./Sidebar";
import DataStore from "../../Store";

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
  setFetchedData: (fetchedData: object) => void;
  isLoading: boolean;
  isError: boolean;
  // connectedToDB: boolean;
  // disconnect: () => void;
  // setConnectedToDB: (param: boolean) => void;
  sideBarOpened: boolean;
  setSideBarOpened: (param: boolean) => void;
  tablename: string;
}

export default function Canvas({
  isLoading,
  isError,
  fetchedData,
  setFetchedData,
  // disconnect,
  // connectedToDB,
  // setConnectedToDB,
  setSideBarOpened,
  tablename,
}: CanvasProps) {
  // const tables: JSX.Element[] = fetchedData.map((table: any, ind: number) => {
  //   return <Table key={`Table${ind}`} id={`table${ind}`} tableInfo={table} />;
  // });

  // with new data structure
  const tables: JSX.Element[] = Object.keys(fetchedData).map(
    (tablename: any, ind: number) => {
      return (
        <Table
          key={`Table${ind}`}
          id={tablename}
          tableInfo={fetchedData[tablename]}
        />
      );
    }
  );
  //console.log("this is fetchedData from Canvas.tsx", fetchedData);
  if (isLoading) {
    return (
      <Text>
        Please Wait... It can take few minutes to complete the retrieval of data
        <Loader size="xl" variant="dots" />
      </Text>
    );
  }

  if (isError) {
    return <>An Error Occurred: Check Your Internet Connection</>;
  }

  let refArray: string[] = [];

  for (let table in fetchedData) {
    for (let column in fetchedData[table]) {
      for (let ref in fetchedData[table][column].References) {
        if (fetchedData[table][column].References[ref].IsDestination == true)
          refArray.push(fetchedData[table][column].References[ref]);
      }
    }
  }

  //console.log(refArray)

  const xa: JSX.Element[] = refArray.map((reff: any) => {
    return (
      <Xarrow
        headSize={5}
        zIndex={-1}
        color={"green"}
        start={reff.PrimaryKeyTableName}
        end={reff.ReferencesTableName}
      />
    );
  });

  // function to submit queries to 
  function executeChanges() {
    console.log(DataStore.store);
    const queriesArray:object = DataStore.store;
    console.log('sending queries array', queriesArray);

    // fetch('/api/handleQueries', {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json",
    // },
      // body: JSON.stringify({
        // queries: queriesArray,
        // PG_URI: link,
    // })
    //    RECEIVING SUCCESS MESSAGE
    //   .then((res) => res.json())
    // .then((res) => {
    //   if (!res.success) continue;
    //     console.log(res)
    //   console.log('clearing queries');
    //   DataStore.clearQueries();
    //   console.log(DataStore.queries);
    // });
    //   .catch(err) => console.log(err);
    // }
  }

  const [refOpened, setRefOpened] = useState(false);

  // console.log("this is tables", tables);
  return (
    <div style={{ height: "100%" }}>
      {Object.keys(fetchedData).length > 0 && DataStore.connectedToDB ? (
        <>
          <Group position="right">
            <Button
              color="white"
              leftIcon={<DatabaseImport />}
              onClick={() => DataStore.disconnect()}
            >
              Disconnect from DB
            </Button>
          </Group>
          <Group position="right">
            <Button
              styles={() => ({
                root: {
                  marginTop: 20,
                }
              })}
              color="red"
              leftIcon={<DatabaseImport />}
              onClick={() => executeChanges()}
            >
              Execute changes
            </Button>
          </Group>

          <Xwrapper>
            {tables}
            {xa}
          </Xwrapper>
        </>
      ) : (
        <>
          {/* "Please Connect to Your Database" */}
          <Group position="right">
            <Button
              color="white"
              leftIcon={<DatabaseImport />}
              onClick={() => setSideBarOpened(true)}
            >
              Connect to DB
            </Button>
          </Group>
        </>
      )}
      {/* <Modal
        opened={refOpened}
        onClose={() => setRefOpened(false)}
        title="Introduce yourself!"
      >
        hi
      </Modal> */}
    </div>
  );
}
