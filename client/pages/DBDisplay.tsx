import axios from "axios";
import React, { useEffect, useState } from "react";
import { useMutation } from "react-query";
import Canvas from "../components/DBDisplay/Canvas";
import DisplayHeader from "../components/DBDisplay/DisplayHeader";
import Sidebar from "../components/DBDisplay/Sidebar";
import { Navigate, useNavigate } from "react-router-dom";
import { useForm } from "@mantine/form";
import DataStore from "../Store";
import {
  Header,
  AppShell,
  Navbar,
  ScrollArea,
  Text,
  UnstyledButton,
  Group,
  ThemeIcon,
  Modal,
  TextInput,
  Box,
  Button,
} from "@mantine/core";
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
  user: {
    email: string | null;
    id: string | null;
    name: string | null;
    picture: string | null;
  };
  setLoggedIn: (e: boolean) => void;
  loggedIn: boolean;
}

export default function DBDisplay({
  user,
  setLoggedIn,
  loggedIn,
}: stateChangeProps) {
  // console.log("in DB Display", user);
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

  const [fetchedData, setFetchedData] = useState({});
  const [connectedToDB, setConnectedToDB] = useState(false);
  const [sideBarOpened, setSideBarOpened] = useState(false);
  const [tablename, setTablename] = useState("");
  const [opened, setOpened] = useState(false);
  

  const { isLoading, isError, mutate } = useMutation(
    (dataToSend: object) => {
      // console.log("logging data", dataToSend);
      // console.log("Time start to load database", Date.now());
      return axios.post("/api/getSchema", dataToSend).then((res) => {
        setFetchedData(res.data);
        console.log("this is retrieved data from server,: ", res.data);
        // console.log("Time Done to Load Database", Date.now());
        DataStore.getData(res.data);
        console.log("this is dataStore: ", DataStore);
      });
    },
    {
      onSuccess: () => {
      setConnectedToDB(true);
      setSideBarOpened(true);
      },
    }
  );

  useEffect(() => {
    setLoggedIn(true);
    localStorage.setItem("isLoggedIn", "true");

    if (loggedIn) {
      const savedData = DataStore.store.get(DataStore.store.size - 1);
      if (savedData) {
        setFetchedData(savedData);
        console.log("this is saved: ", savedData);
      }
    }
  }, []);

  return (
    <AppShell
      padding="md"
      header={
        <DisplayHeader
          name={user.name}
          picture={user.picture}
          opened={opened}
          setOpened={setOpened}
          setLoggedIn={setLoggedIn}
        />
      }
      // navbarOffsetBreakpoint="sm"
      navbar={
        <FeatureTab
          setTablename={setTablename}
          setFetchedData={setFetchedData}
          fetchedData={fetchedData}
        ></FeatureTab>
      }
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
      <Sidebar sideBarOpened={sideBarOpened} setSideBarOpened={setSideBarOpened} isLoading={isLoading} isError={isError} mutate={mutate} />
      <Canvas
        isLoading={isLoading}
        isError={isError}
        fetchedData={fetchedData}
        setFetchedData={setFetchedData}
        connectedToDB={connectedToDB}
        setConnectedToDB={setConnectedToDB}
        sideBarOpened={sideBarOpened}
        setSideBarOpened={setSideBarOpened}
        tablename={tablename}
      />
    </AppShell>
  );
}

interface FeatureTabProps {
  setTablename: (e: string) => void;
  fetchedData: {};
  setFetchedData: (e: {}) => void;
}

function FeatureTab({
  setTablename,
  setFetchedData,
  fetchedData,
}: FeatureTabProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const form = useForm({
    initialValues: {
      tablename: "",
    },
  });

  return (
    <Navbar width={{ base: 300 }} height={500} p="xs">
      {/* <Navbar.Section>LOGO</Navbar.Section> */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Type new table name: "
      >
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form
            onSubmit={form.onSubmit((values) => {
              setTablename(values.tablename);
              setFetchedData({
                ...fetchedData,
                ["public." + values.tablename]: {},
              });
              setModalOpened(false);
              form.setValues({
                tablename: "",
              });
            })}
          >
            <TextInput
              required
              data-autofocus
              label="Table Name: "
              //   autoComplete="arjuna.db.elephantsql.com"
              //   placeholder="Host"
              {...form.getInputProps("tablename")}
            />
            <Group position="right" mt="md">
              <Button type="submit">Create</Button>
            </Group>
          </form>
        </Box>
      </Modal>

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
          onClick={() => setModalOpened(true)}
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
