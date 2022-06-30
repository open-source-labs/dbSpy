import { NavigateBeforeRounded } from "@mui/icons-material";
import axios from "axios";
import React, { useState } from "react";
import { useMutation } from "react-query";
import Canvas from "../components/DBDisplay/Canvas";
import DisplayNavbar from "../components/DBDisplay/DisplayNavbar";
import Sidebar from "../components/DBDisplay/Sidebar";
import { Header, AppShell } from "@mantine/core";
import DisplaySidebar from "../components/DBDisplay/DisplaySidebar";

export default function DBDisplay() {
  const [fetchedData, setFetchedData] = useState({});
  const [opened, setOpened] = useState(false);
  const { isLoading, isError, mutate } = useMutation((dataToSend: object) => {
    console.log("logging data", dataToSend);
    console.log("Time start to load database", Date.now());
    return axios.post("/api/getSchema", dataToSend).then((res) => {
      setFetchedData(res.data);
      console.log("Time Done to Load Database", Date.now());
    });
  });

  return (
    // {/* <Sidebar
    //   fetchedData={fetchedData}
    //   setFetchedData={setFetchedData}
    //   isLoading={isLoading}
    //   isError={isError}
    //   mutate={mutate}
    // /> */}
    <AppShell
      padding="md"
      header={
        <Header height={60} p="xs" sx={{ backgroundColor: "#173e7c" }}>
          <DisplayNavbar opened={opened} setOpened={setOpened} />
        </Header>
      }
      navbarOffsetBreakpoint="sm"
      navbar={<DisplaySidebar opened={opened} setOpened={setOpened} />}
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Canvas fetchedData={fetchedData} setFetchedData={setFetchedData} />
    </AppShell>
  );
}
