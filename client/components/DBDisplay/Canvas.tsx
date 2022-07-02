import React, { useRef } from "react";
import Table from "./Table";
import Xarrow, { Xwrapper } from "react-xarrows";

interface CanvasProps {
  fetchedData: object[];
  setFetchedData: (fetchedData: object[]) => void;
}

export default function Canvas({ fetchedData, setFetchedData }: CanvasProps) {
  console.log(fetchedData);

  const tables: JSX.Element[] = fetchedData.map((table: any, ind: number) => {
    return <Table key={`Table${ind}`} id={`table${ind}`} tableInfo={table} />;
  });

  console.log("this is tables", tables);
  return (
    <div style={{ height: "100%" }}>
      {Object.keys(fetchedData[0]).length > 0 ? (
        <Xwrapper>
          {tables}
          <Xarrow start={"table1"} end={"table0"} />
          <Xarrow start={"table2"} end={"table1"} />
        </Xwrapper>
      ) : (
        "Please Connect to Your Database"
      )}
    </div>
  );
}
