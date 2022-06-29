import { NavigateBeforeRounded } from "@mui/icons-material";
import React from "react";
import Canvas from "../components/DBDisplay/Canvas";
import Navbar from "../components/DBDisplay/Navbar";
import Sidebar from "../components/DBDisplay/Sidebar";

export default function DBDisplay() {
  return (
    <div>
      <Navbar />
      <Sidebar />
      <Canvas />
    </div>
  );
}
