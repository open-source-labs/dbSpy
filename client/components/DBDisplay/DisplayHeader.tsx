// React & React Router & React Query Modules;
import React from "react";
import { Link, useNavigate } from "react-router-dom";

// Components imported;
import MenuPopUp from "./MenuPopUp";

// UI Libraries - Mantine
import { Header, Text, MediaQuery, Button, Image, Box } from "@mantine/core";

interface DisplayHeaderProps {
  menuPopUpOpened: boolean;
  name: string | null;
  picture: string | null | undefined;
  setLoggedIn: (e: boolean) => void;
  setMenuPopUpOpened: (opened: boolean) => void;
}

/** "DisplayHeader" Component - a header for DBDisplay page */
export default function DisplayHeader({
  menuPopUpOpened,
  name,
  picture,
  setLoggedIn,
  setMenuPopUpOpened,
}: DisplayHeaderProps) {
  const navigate = useNavigate();

  if (picture === null) picture = undefined;

  /** "logout" - a function that gets invoked when logout button is clicked on DBDisplay page; GET request to "/logout" path;
   * Receive a data with a format of {logout: true||false};
   * Redirect to main homepage upon both success and failure;
   */
  const logout = () => {
    localStorage.setItem("isLoggedIn", "false");
    sessionStorage.clear();
    fetch("/logout")
      .then((response) => response.json())
      .then((data) => {
        setLoggedIn(false);
        navigate("/");
      })
      .catch((err: {}) => {
        alert(`Logout failed. Error:${err}`);
        navigate("/");
      });
  };

  return (
    <Header height={60} p="xs" sx={{ backgroundColor: "#2b3a42" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          width: "100%",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            width: "33.33%",
          }}
        >
          <MediaQuery largerThan="sm" styles={{ display: "block" }}>
            <MenuPopUp
              opened={menuPopUpOpened}
              setOpened={setMenuPopUpOpened}
            />
          </MediaQuery>

          <Link to="/">
            <Text color="white">Logo</Text>
          </Link>
        </div>

        <div
          style={{
            color: "white",
            borderColor: "white",
            textAlign: "center",
            width: "33.33%",
          }}
        >
          LATEST UPDATE: Version 1.0.0 Launched in July 23rd 2022
        </div>

        <Box
          style={{
            display: "flex",
            alignItems: "center",
            marginRight: "6px",
            justifyContent: "flex-end",
            width: "33.33%",
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
