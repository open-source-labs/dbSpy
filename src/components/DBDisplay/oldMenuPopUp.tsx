import React, { useState } from "react";
import { Link } from "react-router-dom";
import useCredentialsStore from "../../store/credentialsStore";
import { Burger, useMantineTheme, Menu, Divider } from "@mantine/core";
import {
  MessageCircle,
  Database,
  Users,
  Help,
  MessageReport,
} from "tabler-icons-react";

interface MenuPopUpProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
}

export default function MenuPopUp({ opened, setOpened }: MenuPopUpProps) {
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  //END: STATE DECLARATION

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
      <Menu.Label>HELP</Menu.Label>
        <a href="https://www.github.com/oslabs-beta/dbSpy/blob/dev/README.md"> <Menu.Item icon={<Help size={14} />}>
            Documentation
          </Menu.Item>
        </a>

        
      <a href="https://docs.google.com/forms/d/e/1FAIpQLSdaPeCzo41VsJWHbbPzYwvu5Jd-FrXfJZnx23mtFdRVWDWCyg/viewform">
        <Menu.Item icon={<MessageCircle size={14} />}>
          Request a Feature
        </Menu.Item>
      </a>
      <a href="https://docs.google.com/forms/d/e/1FAIpQLScM8UUrZ-bg1My7WY8-XanMFr2o7m2qSUykEeihkis9oiDDpw/viewform">
        <Menu.Item icon={<MessageReport size={14} />}>
          Report a Problem
        </Menu.Item>
      </a>
    </Menu>
  );
}
