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
  Drawer,
  Menu,
  Divider,
} from "@mantine/core";
import {
  Settings,
  Search,
  Photo,
  MessageCircle,
  Trash,
  ArrowsLeftRight,
  Database,
  Users,
  Help,
  MessageReport,
} from "tabler-icons-react";
import { useDisclosure } from "@mantine/hooks";

interface DisplaySidebarProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export default function DisplaySidebar({
  opened,
  setOpened,
}: DisplaySidebarProps) {
  const theme = useMantineTheme();
  const [openedMenu, setOpenedMenu] = useState(false);

  return (
    <Menu
      control={
        <Burger
          opened={opened}
          onClick={() => setOpened(!opened)}
          size="sm"
          color={"white"}
          mr="xl"
        />
      }
      opened={openedMenu}
      onOpen={() => {
        setOpenedMenu(!openedMenu);
        setOpened(!opened);
      }}
      onClose={() => {
        setOpenedMenu(!openedMenu);
        setOpened(!opened);
      }}
    >
      <Menu.Label>ABOUT</Menu.Label>
      <Menu.Item icon={<Database size={14} />}>dbSpy</Menu.Item>
      <Menu.Item icon={<Users size={14} />}>Team</Menu.Item>
      <Divider />
      <Menu.Label>HELP</Menu.Label>
      <Menu.Item icon={<Help size={14} />}>Support/Docs</Menu.Item>
      <Menu.Item icon={<MessageCircle size={14} />}>
        Request a Feature
      </Menu.Item>
      <Menu.Item icon={<MessageReport size={14} />}>Report a Problem</Menu.Item>
    </Menu>
  );
}
