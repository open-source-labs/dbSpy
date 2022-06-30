import { NavigateBeforeRounded } from "@mui/icons-material";
import React, { useState } from "react";
import Canvas from "../components/DBDisplay/Canvas";
import Navbar from "../components/DBDisplay/Navbar";
import Sidebar from "../components/DBDisplay/Sidebar";

export default function DBDisplay() {
  const [fetchedData, setFetchedData] = useState({});
  return (
    <div>
      <Navbar />
      <Sidebar fetchedData={fetchedData} setFetchedData={setFetchedData} />
      <Canvas fetchedData={fetchedData} setFetchedData={setFetchedData} />
    </div>
  );
}
