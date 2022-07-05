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

import { useNavigate } from 'react-router-dom';
import MenuPopUp from "./MenuPopUp";

import { fontFamily } from "@mui/system";

interface DisplayHeaderProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  name: string | null,
}

export default function DisplayHeader({
  opened,
  setOpened,
  name,
}: DisplayHeaderProps) {
  const theme = useMantineTheme();


const navigate = useNavigate();

const logout = ()=> { 
  fetch('/logout')
  .then(response => response.json())
  .then((data) => {
   console.log(data);
   navigate('/login');

   
  })
  .catch((err: {}) => 
    {console.log('Error:', err);
    navigate('/login');
  
  });


console.log("clicked");
};







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
            <MenuPopUp opened={opened} setOpened={setOpened} />
          </MediaQuery>

          <Text color="white">Logo</Text>
        </div>

        <div style={{ color: "white", borderColor: "white" }}>
          LATEST UPDATE: Version 1.0.0 Launched in July 23rd 2022
        </div>

        <div>
        <div><Text color="white"> Welcome, {(name == null) ? " " : name.concat(' ')} </Text></div>
            <Button variant="gradient" gradient={{ from: "blue", to: "black" }} onClick={logout}>
              Sign Out
            </Button>
        
        </div>
      </div>
    </Header>
  );
}
