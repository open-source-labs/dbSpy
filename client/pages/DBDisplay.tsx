// React & React Router & React Query Modules;
import React, { createRef, useEffect, useState } from "react";
import { useMutation } from "react-query";

// Components Imported;
import Canvas from "../components/DBDisplay/Canvas";
import DisplayHeader from "../components/DBDisplay/DisplayHeader";
import FeatureTab from "../components/DBDisplay/FeatureTab";
import Sidebar from "../components/DBDisplay/Sidebar";

// Miscellaneous - axios for REST API request, DataStore for global state management, AppShell for application page frame;
import axios from "axios";
import DataStore from "../Store";
import { AppShell } from "@mantine/core";

interface stateChangeProps {
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  setLoggedIn: (e: boolean) => void;
  loggedIn: boolean;
}

/* "DBDisplay" Component - database visualization application page; only accessible when user is authorized; */
export default function DBDisplay({
  user,
  setLoggedIn,
  loggedIn,
}: stateChangeProps) {
  /* Server Cache State or Form Input State
  "fetchedData" - a state that stores database table model and is used to render database schema tables;
  "tablename" - a state that stores input data (table name for a new table) from "ADD TABLE" feature;
  */
  const [fetchedData, setFetchedData] = useState({});
  const [tablename, setTablename] = useState("");

  /* UI State
  "sideBarOpened" - a state that opens and closes the side bar for database connection;
  "menuPopUpOpened" - a state that opens and closes the Menu Pop Up for when burger icon is clicked;
  */
  const [sideBarOpened, setSideBarOpened] = useState(false);
  const [menuPopUpOpened, setMenuPopUpOpened] = useState(false);

  /* useMutation for handling 'POST' request to '/api/getSchema' route for DB schema dump; 
  initiate "fetchedData" and Map objects in "DataStore" 
  onSuccess: update connectedToDB global state to "true" and close the side bar
  */
  const { isLoading, isError, mutate } = useMutation(
    (dataToSend: object) => {
      return axios.post("/api/getSchema", dataToSend).then((res) => {
        setFetchedData(res.data);
        DataStore.setData(res.data);
        DataStore.setQuery([{ type: "", query: "" }]);
        sessionStorage.Data = JSON.stringify(
          Array.from(DataStore.store.entries())
        );

        sessionStorage.Query = JSON.stringify(
          Array.from(DataStore.queries.entries())
        );

        //Console Log for Testing - "Retrieved data" from server and "DataStore" after initiating Map objects
        console.log("this is retrieved data from server,: ", res.data);
        console.log("this is dataStore: ", DataStore);
      });
    },
    {
      onSuccess: () => {
        DataStore.connect();
        sessionStorage.dbConnect = "true";
        sessionStorage.count = 0;
        setSideBarOpened(false);
      },
    }
  );

  /* useEffect:
  "loggedIn" gets set to "true"; isLoggedIn in localStorage also gets set to "true"
  Gets triggered when table editting is done or History list is clicked.
  Client-side caching implemented with latest update of table model. 
  */
  useEffect(() => {
    setLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");
    if (sessionStorage.dbConnect === "true" && sessionStorage.Data) {
      DataStore.connect();
      const savedData: any = new Map(JSON.parse(sessionStorage.Data));
      const savedQuery: any = new Map(JSON.parse(sessionStorage.Query));
      const latestData: any = savedData.get(savedData.size - 1);
      if (Object.keys(latestData).length > 0) {
        DataStore.store = savedData;
        DataStore.queries = savedQuery;
        DataStore.ind = DataStore.queryInd = DataStore.store.size;
        DataStore.queryList = savedQuery.get(savedQuery.size - 1);
        setFetchedData(latestData);
      }
    }
  }, []);

  useEffect(() => {
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

  /** PREVENT RELOAD OF THE PAGE */
  // useEffect(() => {
  //   window.onbeforeunload = (e) => {
  //     e.preventDefault();
  //     e.returnValue = "";
  //   };
  // }, []);

  /** OLD VERSION TO MANAGE CACHING */
  // useEffect(() => {
  //   setLoggedIn(true);
  //   localStorage.setItem("isLoggedIn", "true");

  //   if (loggedIn && DataStore.ind > 0) {
  //     const savedData = DataStore.getData(DataStore.store.size - 1);
  //     if (savedData) {
  //       setFetchedData(savedData);
  //       console.log("this is saved: ", savedData);
  //     }
  //   }
  // }, []);

  return (
    <AppShell
      padding="md"
      header={
        <DisplayHeader
          name={user.name}
          picture={user.picture}
          menuPopUpOpened={menuPopUpOpened}
          setMenuPopUpOpened={setMenuPopUpOpened}
          setLoggedIn={setLoggedIn}
        />
      }
      // navbarOffsetBreakpoint="sm"
      navbar={
        <FeatureTab
          setSideBarOpened={setSideBarOpened}
          setTablename={setTablename}
          setFetchedData={setFetchedData}
          fetchedData={fetchedData}
        ></FeatureTab>
      }
      styles={(theme) => ({
        root: { height: "100%" },
        body: { height: "100%" },
        main: {
          // backgroundColor: "transparent",
          // zIndex: -5
          // backgroundColor:
          //   theme.colorScheme === "dark"
          //     ? theme.colors.dark[8]
          //     : theme.colors.gray[0],
        },
      })}
    >
      <Sidebar
        sideBarOpened={sideBarOpened}
        setSideBarOpened={setSideBarOpened}
        isLoadingProps={isLoading}
        isErrorProps={isError}
        mutate={mutate}
      />
      <Canvas
        isLoadingProps={isLoading}
        isErrorProps={isError}
        fetchedData={fetchedData}
        setFetchedData={setFetchedData}
        setSideBarOpened={setSideBarOpened}
      />
    </AppShell>
  );
}
