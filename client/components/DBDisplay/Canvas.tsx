import React from "react";
import Table from "./Table";

interface CanvasProps {
  fetchedData: object[];
  setFetchedData: (fetchedData: object[]) => void;
}

export default function Canvas({ fetchedData, setFetchedData }: CanvasProps) {
  console.log(fetchedData);

  const tables = fetchedData.map((table: any, ind: number) => {
    return <Table key={`Table${ind}`} tableInfo={table} />;
  });

  console.log("this is tables", tables);
  return <div style={{ height: "100%" }}>{tables}</div>;
}
