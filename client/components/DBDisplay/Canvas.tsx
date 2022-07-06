import React, { useRef } from "react";
import Table from "./Table";
import Xarrow, { Xwrapper } from "react-xarrows";
import { Loader, Text, Button, Group } from "@mantine/core";
import { Database, DatabaseImport } from "tabler-icons-react";
import { LinearProgress } from "@mui/material";
import Sidebar from './Sidebar'

interface CanvasProps {
  fetchedData: {
    [key: string]: {};
  };
  setFetchedData: (fetchedData: object) => void;
  isLoading: boolean;
  isError: boolean;
  connectedToDB: boolean;
  setConnectedToDB: (param: boolean) => void;
  sideBarOpened: boolean;
  setSideBarOpened: (param: boolean) => void;
  tablename: string;
}

export default function Canvas({
  isLoading,
  isError,
  fetchedData,
  setFetchedData,
  connectedToDB,
  setConnectedToDB,
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

  // console.log("this is tables", tables);
  return (
    <div style={{ height: "100%" }}>
      {Object.keys(fetchedData).length > 0 && connectedToDB ? (
        <>
        <Group position="right">
          <Button color="white"
          leftIcon={<DatabaseImport />} onClick={() => setConnectedToDB(false)}>Disconnect from DB</Button>
        
        </Group>
        <Xwrapper>
          {tables}
          <Xarrow
            headSize={5}
            color={"green"}
            start={"public.accounts"}
            end={"public.location"}
          />
          <Xarrow
            headSize={5}
            color={"green"}
            start={"public.location"}
            end={"public.user"}
          />
        </Xwrapper>
        </>
      ) : (
        <>
        {/* "Please Connect to Your Database" */}
        <Group position="right">
        <Button color="white"
          leftIcon={<DatabaseImport />} onClick={() => setSideBarOpened(true)}>Connect to DB</Button>
        </Group>
        </>
      )
      }
      
    </div>
  );
}
