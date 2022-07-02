import React, { useRef } from "react";
import Table from "./Table";
import Xarrow, { Xwrapper } from "react-xarrows";
import { Loader } from "@mantine/core";

interface CanvasProps {
  fetchedData: object[];
  setFetchedData: (fetchedData: object[]) => void;
  isLoading: boolean;
  isError: boolean;
}

export default function Canvas({
  isLoading,
  isError,
  fetchedData,
  setFetchedData,
}: CanvasProps) {
  console.log(fetchedData);

  const tables: JSX.Element[] = fetchedData.map((table: any, ind: number) => {
    return <Table key={`Table${ind}`} id={`table${ind}`} tableInfo={table} />;
  });

  if (isLoading) {
    return <Loader size="xl" variant="dots" />;
  }
  if (isError) {
    return <>An Error Occurred: Check Your Internet Connection</>;
  }

  console.log("this is tables", tables);
  return (
    <div style={{ height: "100%" }}>
      {Object.keys(fetchedData[0]).length > 0 ? (
        <Xwrapper>
          {tables}
          <Xarrow
            headSize={5}
            color={"green"}
            start={"table1"}
            end={"table0"}
          />
          <Xarrow
            headSize={5}
            color={"green"}
            start={"table2"}
            end={"table1"}
          />
        </Xwrapper>
      ) : (
        "Please Connect to Your Database"
      )}
    </div>
  );
}
