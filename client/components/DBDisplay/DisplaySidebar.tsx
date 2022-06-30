import React from "react";
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

interface DisplaySidebarProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export default function DisplaySidebar({
  opened,
  setOpened,
}: DisplaySidebarProps) {
  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 200, lg: 300 }}
    >
      <Text>Application navbar</Text>
    </Navbar>
  );
}
