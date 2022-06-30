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

interface DisplayNavbarProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export default function DisplayNavbar({
  opened,
  setOpened,
}: DisplayNavbarProps) {
  const theme = useMantineTheme();

  return (
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
          <Burger
            opened={opened}
            onClick={() => setOpened(!opened)}
            size="sm"
            color={theme.colors.gray[6]}
            mr="xl"
          />
        </MediaQuery>

        <Text color={theme.colors.gray[6]}>Logo</Text>
      </div>

      <div>
        <Link to="/">
          <Button variant="gradient" gradient={{ from: "blue", to: "black" }}>
            Sign Out
          </Button>
        </Link>
      </div>
    </div>
  );
}
