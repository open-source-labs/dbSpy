import React, { useState } from "react";
import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Aside,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  Button,
} from "@mantine/core";
import { Link } from "react-router-dom";
import DisplaySidebar from "./DisplaySidebar";
import { fontFamily } from "@mui/system";

interface DisplayHeaderProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export default function DisplayHeader({
  opened,
  setOpened,
}: DisplayHeaderProps) {
  const theme = useMantineTheme();

  return (
    <Header height={60} p="xs" sx={{ backgroundColor: "#2b3a42" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          <MediaQuery largerThan="sm" styles={{ display: "block" }}>
            <DisplaySidebar opened={opened} setOpened={setOpened} />
          </MediaQuery>

          <Text color="white">Logo</Text>
        </div>

        <div style={{ color: "white", borderColor: "white" }}>
          LATEST UPDATE: Version 1.0.0 Launched in July 23rd 2022
        </div>

        <div>
          <Link to="/">
            <Button
              variant="outline"
              sx={{ color: "white", borderColor: "white" }}
            >
              Sign Out
            </Button>
          </Link>
        </div>
      </div>
    </Header>
  );
}
