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
    <Header height={60} p="xs" sx={{ backgroundColor: "#173e7c" }}>
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

        <div>
          <Link to="/">
            <Button variant="gradient" gradient={{ from: "blue", to: "black" }}>
              Sign Out
            </Button>
          </Link>
        </div>
      </div>
    </Header>
  );
}
