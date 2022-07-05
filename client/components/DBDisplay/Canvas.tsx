import React, { useRef } from "react";
import Table from "./Table";
import Xarrow, { Xwrapper } from "react-xarrows";
import { Loader, Text } from "@mantine/core";
import { LinearProgress } from "@mui/material";

interface CanvasProps {
  fetchedData: {
    [key: string]: {};
  };
  setFetchedData: (fetchedData: object) => void;
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

  // const tables: JSX.Element[] = fetchedData.map((table: any, ind: number) => {
  //   return <Table key={`Table${ind}`} id={`table${ind}`} tableInfo={table} />;
  // });

  // with new data structure
  const tables: JSX.Element[] = Object.keys(fetchedData).map(
    (tablename: any, ind: number) => {
      return (
        <Table
          key={`Table${ind}`}
          id={tablename}
          tableInfo={fetchedData[tablename]}
        />
      );
    }
  );

  if (isLoading) {
    return (
      <Text>
        Please Wait... It can take few minutes to complete the retrieval of data
        <Loader size="xl" variant="dots" />
      </Text>
    );
  }

  if (isError) {
    return <>An Error Occurred: Check Your Internet Connection</>;
  }

  console.log("this is tables", tables);
  return (
    <div style={{ height: "100%" }}>
      {Object.keys(fetchedData).length > 0 ? (
        <Xwrapper>
          {tables}
          <Xarrow
            headSize={5}
            color={"green"}
            start={"public.accounts"}
            end={"public.location"}
          />
          <Xarrow
            headSize={5}
            color={"green"}
            start={"public.location"}
            end={"public.user"}
          />
        </Xwrapper>
      ) : (
        "Please Connect to Your Database"
      )}
    </div>
  );
}
