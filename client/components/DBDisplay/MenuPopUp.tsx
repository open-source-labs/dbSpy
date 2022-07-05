import React, { useState } from "react";
import { Burger, useMantineTheme, Menu, Divider } from "@mantine/core";
import {
  MessageCircle,
  Database,
  Users,
  Help,
  MessageReport,
} from "tabler-icons-react";
import { Link } from "react-router-dom";

interface MenuPopUpProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export default function MenuPopUp({ opened, setOpened }: MenuPopUpProps) {
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
      <Link to="/">
        <Menu.Item icon={<Database size={14} />}>dbSpy</Menu.Item>
      </Link>
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
