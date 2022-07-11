import React, { useRef, useState } from "react";
import Table from "./Table";
import Xarrow, { Xwrapper } from "react-xarrows";
import { Loader, Text, Button, Group, Modal } from "@mantine/core";
import { Database, DatabaseImport } from "tabler-icons-react";
import { LinearProgress } from "@mui/material";
import Sidebar from "./Sidebar";
import DataStore from "../../Store";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

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
  isLoadingProps: boolean;
  isErrorProps: boolean;
  // connectedToDB: boolean;
  // disconnect: () => void;
  // setConnectedToDB: (param: boolean) => void;
  sideBarOpened: boolean;
  setSideBarOpened: (param: boolean) => void;
  tablename: string;
  setNumEdit: (numEdit: number) => void;
  numEdit: number;
}

export default function Canvas({
  isLoadingProps,
  isErrorProps,
  fetchedData,
  setFetchedData,
  // disconnect,
  // connectedToDB,
  // setConnectedToDB,
  setSideBarOpened,
  tablename,
  setNumEdit,
  numEdit,
}: CanvasProps) {
  // const tables: JSX.Element[] = fetchedData.map((table: any, ind: number) => {
  //   return <Table key={`Table${ind}`} id={`table${ind}`} tableInfo={table} />;
  // });
  console.log("this is fetchedData from Canvas.tsx", fetchedData);

  // with new data structure
  const tables: JSX.Element[] = Object.keys(fetchedData).map(
    (tablename: any, ind: number) => {
      return (
        <Table
          key={`Table${ind}`}
          id={tablename}
          tableInfo={fetchedData[tablename]}
          setNumEdit={setNumEdit}
          numEdit={numEdit}
          setFetchedData={setFetchedData}
        />
      );
    }
  );

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
        endAnchor={[
          { position: "right", offset: { x: +10, y: +10 } },
          { position: "left", offset: { x: -10, y: -10 } },
          { position: "bottom", offset: { x: +10, y: +10 } },
          { position: "top", offset: { x: -10 } },
        ]}
        curveness={1.0}
        animateDrawing={2}
      />
    );
  });

  const { isLoading, isError, mutate } = useMutation(
    (dbQuery: object) => {
      console.log("logging data", dbQuery);

      return axios.post("/api/handleQueries", dbQuery).then((res) => {
        console.log("this is retrieved data from server", res.data);
      });
    },
    {
      onSuccess: () => {
        // console.log("clearing DataStore.queries");
        const latestTableModel: any = DataStore.store.get(
          DataStore.store.size - 1
        );
        DataStore.clearStore();
        DataStore.setQuery([{ type: "", query: "" }]);
        DataStore.setData(latestTableModel);
        setFetchedData(latestTableModel);
        console.log("is DataStore cleared?", DataStore);
      },
      onError: () => {
        console.log("Failed to execute changes");
        // res?.success;
      },
    }
  );

  // function to submit queries to
  const executeChanges = () => {
    // const queriesObject:object = DataStore.queries;
    // console.log('sending queries array', queriesObject);
    const obj = JSON.parse(JSON.stringify(DataStore.userDBInfo));
    // console.log(obj);

    // creating URI for server to connect to user's db
    let db_uri =
      "postgres://" +
      obj.username +
      ":" +
      obj.password +
      "@" +
      obj.hostname +
      ":" +
      obj.port +
      "/" +
      obj.database_name;
    // console.log(db_uri);

    // uri examples
    // DATABASE_URL=postgres://{user}:{password}@{hostname}:{port}/{database-name}
    // "postgres://YourUserName:YourPassword@YourHostname:5432/YourDatabaseName";

    const dbQuery = {
      queries: DataStore.queries.get(DataStore.queries.size - 1),
      uri: db_uri,
    };

    console.log("logging dbQuery", dbQuery);
    mutate(dbQuery);

    // fetch('/api/handleQueries', {
    //   method: 'POST',
    //   headers: {
    //     "Content-Type": "application/json",
    // },
    // body: JSON.stringify({
    // queries: queriesArray,
    // PG_URI: link,
    // })
    //    UPON SUCCESS MESSAGE
    //   .then((res) => res.json())
    // .then((res) => {
    //   if (!res.success) continue;
    //     console.log(res)
    //   console.log('clearing queries');
    //   DataStore.clearStore();
    //   console.log(DataStore.queries);
    // });
    //   .catch(err) => console.log(err);
    // }
  };

  const [refOpened, setRefOpened] = useState(false);

  if (isLoadingProps) {
    return (
      <Text>
        Please Wait... It can take few minutes to complete the retrieval of data
        <Loader size="xl" variant="dots" />
      </Text>
    );
  }

  if (isErrorProps) {
    return <>An Error Occurred: Check Your Internet Connection</>;
  }

  if (isLoading) {
    return (
      <h3>
        Please Wait... It can take few minutes to complete the retrieval of data
        <Loader size="xl" variant="dots" />
      </h3>
    );
  }

  if (isError) {
    return <h3>An Error Occurred: Check Your Internet Connection</h3>;
  }

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
                },
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
