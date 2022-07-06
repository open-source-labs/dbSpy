import axios from "axios";
import React, {useEffect ,useState } from "react";
import { useMutation } from "react-query";
import Canvas from "../components/DBDisplay/Canvas";
import DisplayHeader from "../components/DBDisplay/DisplayHeader";
import Sidebar from "../components/DBDisplay/Sidebar";
import {
  Header,
  AppShell,
  Navbar,
  ScrollArea,
  Text,
  UnstyledButton,
  Group,
  ThemeIcon,
} from "@mantine/core";

import { Navigate, useNavigate } from "react-router-dom";
import MenuPopUp from "../components/DBDisplay/MenuPopUp";

import {
  ArrowBackUp,
  Camera,
  Database,
  DatabaseImport,
  DeviceFloppy,
  Plus,
  Upload,
} from "tabler-icons-react";

interface stateChangeProps {
 user : {
 email: string | null, 
 id: string | null, 
 name: string | null, 
 picture: string | null, 
 }

}





export default function DBDisplay({user}:stateChangeProps) {
  console.log('in DB Display', user);
  const navigate = useNavigate();

  /*
  useEffect(() => {

    // declare the async data fetching function
    const fetchData = async () => {
      const data = await fetch('/protected');
      // convert data to json
      const result = await data.json();
     
      if (result == null)
      {
        navigate('/login');
      }
    
    }
  
    // call the function
    fetchData()
      // make sure to catch any error
      .catch(err=> {
        console.error
        navigate('/login')
      });
  
  },[])
*/





  const [buttonText, setButtonText] = useState('Connect to Database')
  const [fetchedData, setFetchedData] = useState({});
  const [connectedToDB, setConnectedToDB] = useState(false);
  const [sideBarOpened, setSideBarOpened] = useState(false);
  
  const [opened, setOpened] = useState(false);
  const { isLoading, isError, mutate } = useMutation((dataToSend: object) => {
    console.log("logging data", dataToSend);
    console.log("Time start to load database", Date.now());
    return axios.post("/api/getSchema", dataToSend).then((res) => {
      setFetchedData(res.data);
      console.log("this is retrieved data from server,: ", res.data);
      console.log("Time Done to Load Database", Date.now());
    });
  }, {onSuccess: () => {
      console.log(connectedToDB);
      setConnectedToDB(true);
      setSideBarOpened(true);
      console.log(connectedToDB);
      setButtonText("Disconnect from Database");
    }});

  return (
    <AppShell
      padding="md"
      header={<DisplayHeader name={user.name} opened={opened} setOpened={setOpened} />}
      // navbarOffsetBreakpoint="sm"
      navbar={<FeatureTab></FeatureTab>}
      styles={(theme) => ({
        root: { height: "100%" },
        body: { height: "100%" },
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      })}
    >
      <Sidebar sideBarOpened={sideBarOpened} setSideBarOpened={setSideBarOpened} buttonText={buttonText} setButtonText={setButtonText} isLoading={isLoading} isError={isError} mutate={mutate} />
      <Canvas
        isLoading={isLoading}
        isError={isError}
        fetchedData={fetchedData}
        setFetchedData={setFetchedData}
        connectedToDB={connectedToDB}
        setConnectedToDB={setConnectedToDB}
        sideBarOpened={sideBarOpened}
        setSideBarOpened={setSideBarOpened}
      />
    </AppShell>
  );
}

function FeatureTab() {
  return (
    <Navbar width={{ base: 300 }} height={500} p="xs">
      {/* <Navbar.Section>LOGO</Navbar.Section> */}

      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <div style={{ fontSize: "24px", margin: "10px" }}>FILE</div>
        <hr />
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <Database />
            </ThemeIcon>
            <Text size="md">CREATE NEW</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <Upload />
            </ThemeIcon>
            <Text size="md">LOAD JSON FILE</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <DatabaseImport />
            </ThemeIcon>
            <Text size="md">LOAD SQL FILE</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <DeviceFloppy />
            </ThemeIcon>
            <Text size="md">SAVE</Text>
          </Group>
        </UnstyledButton>
      </Navbar.Section>
      <Navbar.Section>
        <div style={{ fontSize: "24px", margin: "10px" }}>EDIT</div> <hr />
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <Plus />
            </ThemeIcon>
            <Text size="md">ADD TABLE</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <ArrowBackUp />
            </ThemeIcon>
            <Text size="md">UNDO</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark"
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <Camera />
            </ThemeIcon>
            <Text size="md">SCREENSHOT</Text>
          </Group>
        </UnstyledButton>
      </Navbar.Section>
    </Navbar>
  );
}
