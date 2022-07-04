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
import { useNavigate } from 'react-router-dom';

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
        <div><Text color="white"> Welcome, {(name == null) ? " " : name.concat(' ')} </Text></div>
            <Button variant="gradient" gradient={{ from: "blue", to: "black" }} onClick={logout}>
              Sign Out
            </Button>
        
        </div>
      </div>
    </Header>
  );
}
