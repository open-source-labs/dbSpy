import React, { useState } from "react";
import {
  Header,
  Text,
  MediaQuery,
  useMantineTheme,
  Button,
  Image,
  Box,
} from "@mantine/core";

import { useNavigate } from "react-router-dom";
import MenuPopUp from "./MenuPopUp";
import { Link } from "react-router-dom";

interface DisplayHeaderProps {
  opened: boolean;
  setOpened: (opened: boolean) => void;
  name: string | null;
  picture: string | null | undefined;
  setLoggedIn: (e: boolean) => void;
}

export default function DisplayHeader({
  opened,
  setOpened,
  name,
  picture,
  setLoggedIn,
}: DisplayHeaderProps) {
  const theme = useMantineTheme();
  const navigate = useNavigate();

  if (picture === null) picture = undefined;
  // console.log(picture);

  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLoggedIn(false);
        navigate("/");
      })
      .catch((err: {}) => {
        console.log("Error:", err);
        navigate("/");
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            flex: "1fr",
          }}
        >
          <MediaQuery largerThan="sm" styles={{ display: "block" }}>
            <MenuPopUp opened={opened} setOpened={setOpened} />
          </MediaQuery>

          <Link to="/">
            <Text color="white">Logo</Text>
          </Link>
        </div>

        <div style={{ color: "white", borderColor: "white", flex: "1fr" }}>
          LATEST UPDATE: Version 1.0.0 Launched on July 23rd, 2022
        </div>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "6px",
            flex: "1fr",
          }}
        >
          <Text color="white" style={{ fontSize: "12px" }}>
            {" "}
            Welcome, {name == null ? " " : name.concat(" ")}{" "}
          </Text>
          <Image
            radius="lg"
            src="https://cdn.pixabay.com/photo/2013/07/13/12/07/avatar-159236__340.png"
            alt="profile pic"
            style={{ width: "30px", margin: "0px 10px" }}
          />
          <Button
            variant="outline"
            style={{ color: "white", border: "1px solid white" }}
            onClick={logout}
          >
            Sign Out
          </Button>
        </Box>
      </div>
    </Header>
  );
}
