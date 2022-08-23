// React & React Router & React Query Modules;
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useMutation } from "react-query";

// Components Imported;
import Canvas from "../components/DBDisplay/Canvas";
import DisplayHeader from "../components/DBDisplay/DisplayHeader";
import FeatureTab from "../components/DBDisplay/FeatureTab";
import Sidebar from "../components/DBDisplay/Sidebar";

// Miscellaneous - axios for REST API request, DataStore for global state management, AppShell for application page frame;
import axios from "axios";
import DataStore from "../Store";
import {
  AppShell,
  Box,
  Button,
  Collapse,
  ScrollArea,
  Text,
} from "@mantine/core";
import { toPng } from "html-to-image";

//import fileSaver for export queries
import FileSaver from 'file-saver'



interface stateChangeProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  setUser: (user: any) => void;
}

/* "DBDisplay" Component - database visualization application page; only accessible when user is authorized; */
export default function DBDisplay({ user, setUser }: stateChangeProps) {
  /* Server Cache State or Form Input State
  "fetchedData" - a state that stores database table model and is used to render database schema tables;
  "tablename" - a state that stores input data (table name for a new table) from "ADD TABLE" feature;
  */
  const [fetchedData, setFetchedData] = useState({});
  const [tablename, setTablename] = useState("");

  const ref = useRef<HTMLDivElement>(null);

  /* UI State
  "sideBarOpened" - a state that opens and closes the side bar for database connection;
  "menuPopUpOpened" - a state that opens and closes the Menu Pop Up for when burger icon is clicked;
  */
  const [sideBarOpened, setSideBarOpened] = useState(false);
  const [menuPopUpOpened, setMenuPopUpOpened] = useState(false);
  const [queryOpened, setQueryOpen] = useState(true);
  //state to keep track of which SQL syntax Query Generator is generating, Postgres or MySQL. 
  const [sqlOpen, setSqlOpen] = useState(true);

  /* useMutation for handling 'POST' request to '/api/getSchema' route for DB schema dump; 
  initiate "fetchedData" and Map objects in "DataStore" 
  onSuccess: update connectedToDB global state to "true" and close the side bar
  */
  const { isLoading, isError, mutate } = useMutation(
    (dataToSend: object) => {
      return axios.post("/api/getSchema", dataToSend).then((res) => {
        // Once connected to Database, we need to clear DataStore and Query, Data, loadedFile from sessionStorage in case the user interacted with SQL load or New Canvas feature.
        DataStore.clearStore();
        sessionStorage.removeItem("Query");
        sessionStorage.removeItem("Data");
        sessionStorage.removeItem("loadedFile");

        // Then, update DataStore table data with response data and set query to empty.
        DataStore.setData(res.data);
        DataStore.setQuery([{ type: "", query: "" }]);

        // Update sessionStorage Data and Query with recently updated DataStore.
        sessionStorage.Data = JSON.stringify(
          Array.from(DataStore.store.entries())
        );
        sessionStorage.Query = JSON.stringify(
          Array.from(DataStore.queries.entries())
        );

        // Update the rendering of the tables with latest table model.
        setFetchedData(res.data);

        // Console Log for Testing - "Retrieved data" from server and "DataStore" after initiating Map objects
        console.log("this is retrieved data from server,: ", res.data);
        console.log("this is dataStore: ", DataStore);
      });
    },
    {
      onSuccess: () => {
        // Upon success of DB connection, we dbConnect in DataStore to "true"
        DataStore.connect();

        // Update sessionStorage.dbConnect to "true" also.
        sessionStorage.dbConnect = "true";

        // Then close the side bar that was opened.
        setSideBarOpened(false);
      },
      onError: () => {
        // Upon error, we alert the user that there's an issue with DB connection.
        alert("Database connection has failed.");
      },
    }
  );

  /* useEffect1:
  Updates global state "DataStore" upon landing of the page with sessionStorage data.
  Gets triggered once when landing of the page (i.e. refresh of browser, coming from different pages)
  Client-side caching implemented with latest update of table model. 
  */
  useEffect(() => {
    // if the user is connected to either database or loaded a sql file, AND there's a Data store in sessionStorage, we will go through this useEffect
    if (
      (sessionStorage.dbConnect === "true" ||
        sessionStorage.loadedFile === "true") &&
      sessionStorage.Data
    ) {
      // if the user is connected to Database, update DataStore with dbConnect and userDBInfo
      if (sessionStorage.dbConnect && sessionStorage.userDBInfo) {
        DataStore.connect();
        DataStore.userDBInfo = JSON.parse(sessionStorage.userDBInfo);
        // if the user uploaded a sql file, update DataStore with loadedFile
      } else if (sessionStorage.loadedFile) {
        DataStore.loadedFile = true;
      }

      // parse the Data and Query from sessionStorage and grab the latest table model from savedData
      const savedData: any = new Map(JSON.parse(sessionStorage.Data));
      const savedQuery: any = new Map(JSON.parse(sessionStorage.Query));
      const latestData: any = savedData.get(savedData.size - 1);

      //Update DataStore with all of the table models and queries saved before refresh of the browser.
      DataStore.store = savedData;
      DataStore.queries = savedQuery;
      DataStore.ind = DataStore.queryInd = DataStore.store.size;
      DataStore.queryList = savedQuery.get(savedQuery.size - 1);

      //Update fetchedData to render the latest table model.
      setFetchedData(latestData);
    }
  }, []);

  /* useEffect2:
  Updates sessionStorage with current "fetchedData"
  Gets triggered on landing of the page and when table editting is done (updating "fetchedData")
  */
  useEffect(() => {
    // This logic ensures sessionStorage Query and Data gets updated upon either db connection or sql upload (when data's existing already)
    if (DataStore.store.size > 0 && DataStore.queries.size > 0) {
      sessionStorage.Query = JSON.stringify(
        Array.from(DataStore.queries.entries())
      );
      sessionStorage.Data = JSON.stringify(
        Array.from(DataStore.store.entries())
      );
    }
    console.log("store size after reload", DataStore.store.size);
  }, [fetchedData]);

  /** UseEffect to PREVENT RELOAD OF THE PAGE */
  // useEffect(() => {
  //   window.onbeforeunload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };
  // }, []);

  /** UseEffect of OLD VERSION TO MANAGE CACHING */
  // useEffect(() => {
  //   if (loggedIn && DataStore.ind > 0) {
  //     const savedData = DataStore.getData(DataStore.store.size - 1);
  //     if (savedData) {
  //       setFetchedData(savedData);
  //       console.log("this is saved: ", savedData);
  //     }
  //   }
  // }, []);

  //To export queries
  // const exportQueries = () =>{
  //   const ex = DataStore.exportData().join('')
  //   console.log("this is join", ex)
  //   const data =  new Blob(ex,
  //   /* {type: 'text/plain;charset=utf-8', */
  //   {type: 'text/plain;charset=utf-8', 
  //   endings: 'native'});
  //   //console.log(data);
  //   FileSaver.saveAs(data, "ExportQueries.txt")
  // };

  const exportQueries = () =>{
    const ex = DataStore.exportData()
    console.log(ex)
    // console.log("this is join", ex)
    const data =  new Blob(ex,
    {type: 'text/plain;charset=utf-8', 
    endings: 'native'});
    console.log(data);
    FileSaver.saveAs(data[1], "ExportQueries.txt")
  };

  const screenshot = useCallback(() => {
    if (ref.current === null) {
      return;
    }
    toPng(ref.current, { cacheBust: true })
      .then((dataUrl) => {
        const link = document.createElement("a");
        link.download = "dbScreenshot.png";
        link.href = dataUrl;
        link.click();
      })
      .catch((err) => {
        console.log(err);
      });
  }, [ref]);

  let queries: any;
  if (DataStore.queries.size > 0) {
    queries = DataStore.queries.get(DataStore.queries.size - 1);
    queries = queries.map(
      (query: { type: string; query: string }, ind: number) => {
        return <Text key={ind}>{`${query.query}`}</Text>;
      }
    );
  }

  let queryGen: string;
  if (sqlOpen === true){
    queryGen = "PostgreSQL";
  }else {queryGen = "MySQL";}

  return (
    <AppShell
      padding="md"
      header={
        <DisplayHeader
          name={user.name}
          picture={user.picture}
          menuPopUpOpened={menuPopUpOpened}
          setMenuPopUpOpened={setMenuPopUpOpened}
          setUser={setUser}
        />
      }
      // navbarOffsetBreakpoint="sm"
      navbar={
        <FeatureTab
          setSideBarOpened={setSideBarOpened}
          setTablename={setTablename}
          setFetchedData={setFetchedData}
          fetchedData={fetchedData}
          screenshot={screenshot}
        ></FeatureTab>
      }
      styles={(theme) => ({
        root: { height: "100%" },
        body: { height: "100%" },
        main: {},
      })}
    >
      <Sidebar
        sideBarOpened={sideBarOpened}
        setSideBarOpened={setSideBarOpened}
        isLoadingProps={isLoading}
        isErrorProps={isError}
        mutate={mutate}
      />
      {DataStore.loadedFile && (
        <Box
          sx={{
            display: "flex",
            alignItems: "end",
            flexDirection: "column",
          }}
        >

         <Button
            styles={(theme: any) => ({
              root: {
                backgroundColor: "#3c4e58",
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,
                marginBottom: 20,

                "&:hover": {
                  backgroundColor: theme.fn.darken("#2b3a42", 0.1),
                },
              },
            })}
            onClick={() => setSqlOpen((o) => !o)}    
            >
              {sqlOpen ? "PostgreSQL" : "MySQL"}
          </Button>
          <Button
            styles={(theme) => ({
              root: {
                backgroundColor: "#3c4e58",
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,

                "&:hover": {
                  backgroundColor: theme.fn.darken("#2b3a42", 0.1),
                },
              },
            })}
            onClick={() => setQueryOpen((o) => !o)}
          >
            {queryOpened ? "Hide Queries" : "Show Queries"}
          </Button>

          <Collapse in={queryOpened}>
            <ScrollArea
              style={{
                height: 250,
                width: 500,
                backgroundColor: "white",
                borderRadius: "5px",
                border: "2px solid #2b3a42",
                padding: "5px"
              }}
              type="always"
            >
              <Text sx={{ fontSize: "20px", paddingLeft: "10px" }}>
                {" "}
                {queryGen} Query Generator
              </Text>
              <hr style={{margin: "5px"}}/>
              <Text sx={{ paddingLeft: "10px" }}>{queries}</Text>
            </ScrollArea>
          </Collapse>
          <Button
            styles={(theme: any) => ({
              root: {
                backgroundColor: "#3c4e58",
                border: 0,
                height: 42,
                paddingLeft: 20,
                paddingRight: 20,
                marginTop: 20,

                "&:hover": {
                  backgroundColor: theme.fn.darken("#2b3a42", 0.1),
                },
              },
            })}
            onClick={() =>  {
            console.log("run export");
            exportQueries()
            }
          }
            >
              Export Queries
            </Button>
        </Box>
      )}


      <Canvas
        sqlOpen={sqlOpen}
        setSqlOpen={setSqlOpen}
        isLoadingProps={isLoading}
        isErrorProps={isError}
        fetchedData={fetchedData}
        setFetchedData={setFetchedData}
        setSideBarOpened={setSideBarOpened}
        reference={ref}
      />
    </AppShell>
  );
}
