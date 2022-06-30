import React from "react";
import Table from "./Table";

interface CanvasProps {
  fetchedData: object;
  setFetchedData: (fetchedData: object) => void;
}

export default function Canvas({ fetchedData, setFetchedData }: CanvasProps) {
  return (
    <div>
      <Table fetchedData={fetchedData} setFetchedData={setFetchedData} />
    </div>
  );
}
