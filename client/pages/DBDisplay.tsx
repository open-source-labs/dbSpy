import { NavigateBeforeRounded } from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";
import { useMutation } from "react-query";
import Canvas from "../components/DBDisplay/Canvas";
import Navbar from "../components/DBDisplay/Navbar";
import Sidebar from "../components/DBDisplay/Sidebar";

export default function DBDisplay() {
  const [fetchedData, setFetchedData] = useState({});
  const { isLoading, isError, mutate } = useMutation((dataToSend: object) => {
    console.log("logging data", dataToSend);
    console.log("Time start to load database", Date.now());
    return axios.post("/api/getSchema", dataToSend).then((res) => {
      setFetchedData(res.data);
      console.log("Time Done to Load Database", Date.now());
    });
  });

  return (
    <div>
      <Navbar />
      <Sidebar
        fetchedData={fetchedData}
        setFetchedData={setFetchedData}
        isLoading={isLoading}
        isError={isError}
        mutate={mutate}
      />
      <Canvas fetchedData={fetchedData} setFetchedData={setFetchedData} />
    </div>
  );
}
