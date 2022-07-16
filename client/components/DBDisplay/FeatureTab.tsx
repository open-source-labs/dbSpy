// React & React Router & React Query Modules
import React, { useEffect, useState } from "react";

// Components imported;
import DataStore from "../../Store";
import parseSql from "../../parse";
import { permissiveTableCheck } from "../../permissiveFn";

// UI Libraries - Mantine, tabler-icons
import { useForm } from "@mantine/form";
import {
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
  ArrowForwardUp,
  Camera,
  DatabaseImport,
  DeviceFloppy,
  Plus,
  File,
  FileUpload,
  Eraser
} from "tabler-icons-react";

interface FeatureTabProps {
  setTablename: (e: string) => void;
  fetchedData: {};
  setFetchedData: (e: {}) => void;
  setSideBarOpened: (param: boolean) => void;
  screenshot: any;
}

/** "FeatureTab" Component - a tab positioned in the left of the page to access features of the app; */
export default function FeatureTab({
  setTablename,
  setFetchedData,
  setSideBarOpened,
  fetchedData,
  screenshot,
}: FeatureTabProps) {
  /* Form Input State
  "form" - a state that initializes the value of the form for Mantine;
  */
  const form = useForm({
    initialValues: {
      tablename: "",
    },
  });
  /* UI State
  "modalOpened" - a state that opens and closes the input box for tablename when adding a new table to the Schema;
  "history" - a state that tracks the list of history when table schema is editted
  */
  const [modalOpened, setModalOpened] = useState(false);
  const [history, setHistory] = useState([]);

  /* 
  "undo" - a function that gets invoked when Undo button is clicked; render previous table
  "redo" - a function that gets invoked when Redo button is clicked; render next table
  */
  function undo() {
    if (DataStore.counter > 0) {
      const prev: any = DataStore.getData(DataStore.counter - 1);
      setFetchedData(prev);
      DataStore.counter--;
    }
  }

  function redo() {
    if (DataStore.counter < DataStore.store.size) {
      const next: any = DataStore.getData(DataStore.counter);
      setFetchedData(next);
      DataStore.counter++;
    }
  }

  function uploadSQL() {
    // creating an input element for user to upload sql file
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.click();
    input.onchange = (e: any): void => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        //After the file is uploaded, we need to clear DataStore and clear out Query and Data from session Storage
        DataStore.clearStore();
        sessionStorage.removeItem("Query");
        sessionStorage.removeItem("Data");

        //Then, we will make loadedFile to true to render Canvas without "Disconnect to DB" and "Execute" buttons
        DataStore.loadedFile = true;

        //Parse the .sql file into a data structure that is same as "fetchedData" and store it into a variable named "parsedData"
        const parsedData = parseSql(event.target.result);

        //Update DataStore data with parsedData and reset to an empty query
        DataStore.setData(parsedData);
        DataStore.setQuery([{ type: "", query: "" }]);

        //Update sessionStorage Data and Query with recently updated DataStore.
        sessionStorage.Data = JSON.stringify(
          Array.from(DataStore.store.entries())
        );
        sessionStorage.Query = JSON.stringify(
          Array.from(DataStore.queries.entries())
        );

        //Update the rendering of the tables with latest table model.
        setFetchedData(parsedData);
      };
    };
  }

  /* useEffect:
    Gets invoked when fetchedData is updated;
    Updates "history" by iterating through the list of edits have made so far;
  */
  useEffect(() => {
    let historyComponent: any = [];
    const cacheIterator = DataStore.store.keys();
    for (let cache of cacheIterator) {
      const data: any = DataStore.store.get(cache);
      const num: any = cache;
      historyComponent.push(
        <UnstyledButton
          sx={(theme) => ({
            display: "block",
            width: "100%",
            padding: "2px 10px",
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
          onClick={() => {
            setFetchedData(data);
            DataStore.counter = num;
          }}
          key={num}
        >
          <Group>
            {num === 0 && <Text size="md">{`Initial Data`}</Text>}
            {num === 1 && <Text size="md">{`${num}st Edit`}</Text>}
            {num === 2 && <Text size="md">{`${num}nd Edit`}</Text>}
            {num === 3 && <Text size="md">{`${num}rd Edit`}</Text>}
            {num > 3 && <Text size="md">{`${num}th Edit`}</Text>}
          </Group>
        </UnstyledButton>
      );
    }
    setHistory(historyComponent);
  }, [fetchedData]);

  return (
    <Navbar width={{ base: 225 }} height={"100%"} p="xs">
      {/* <Navbar.Section>LOGO</Navbar.Section> */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="What is the name of your table?"
      >
        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form
            onSubmit={form.onSubmit((values) => {
              const result: any = permissiveTableCheck(
                values.tablename,
                fetchedData,
                {
                  ...fetchedData,
                  ["public." + values.tablename]: {},
                }
              );

              if (result[0].errorMsg) {
                alert(result[0].errorMsg);
              } else {
                setTablename(values.tablename);
                setFetchedData({
                  ...fetchedData,
                  ["public." + values.tablename]: {},
                });
                setModalOpened(false);
                DataStore.setData({
                  ...fetchedData,
                  ["public." + values.tablename]: {},
                });
                DataStore.queryList.push(...result);
                DataStore.setQuery(DataStore.queryList.slice());
              }
              form.setValues({
                tablename: "",
              });
            })}
          >
            <TextInput
              required
              data-autofocus
              label="Table Name: "
              {...form.getInputProps("tablename")}
            />
            <Group position="right" mt="md">
              <Button color="dark" type="submit">Create</Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Navbar.Section>
        <div style={{ fontSize: "24px", margin: "10px" }}>File</div>
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
          onClick={() => {
            if (DataStore.connectedToDB) {
              alert("Please disconnect your database first.");
            } else setSideBarOpened(true);
          }}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <DatabaseImport />
            </ThemeIcon>
            <Text size="md">Connect Database</Text>
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
          onClick={() => {
            if (DataStore.connectedToDB) {
              alert("Please disconnect your database first.");
            } else uploadSQL();
          }}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <FileUpload />
            </ThemeIcon>
            <Text size="md">Upload SQL File </Text>
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
          onClick={() => {
            if (DataStore.connectedToDB) {
              alert('Please disconnect your database first.')
              return
            } else if (DataStore.loadedFile) {
              alert('Please clear the canvas first.')
              return
            } else {
              DataStore.loadedFile = true;
              sessionStorage.loadedFile = "true";
              setModalOpened(true);
            }
            
          }}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <File />
            </ThemeIcon>
            <Text size="md">Build Database</Text>
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
          onClick={() => {
            if (DataStore.connectedToDB) {
              alert('Please disconnect your database first.')
              return
            } else if (DataStore.loadedFile) {
              sessionStorage.clear();
              DataStore.loadedFile = false;
              location.reload();
            }
            
          }}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <Eraser />
            </ThemeIcon>
            <Text size="md">Clear Canvas</Text>
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
          onClick={() => alert("Feature coming soon!")}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <DeviceFloppy />
            </ThemeIcon>
            <Text size="md">Save</Text>
          </Group>
        </UnstyledButton>
      </Navbar.Section>
      <br />
      <br />
      <Navbar.Section>
        <div style={{ fontSize: "24px", margin: "10px" }}>Edit</div> <hr />
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
          onClick={() => {
            DataStore.loadedFile = true;
            sessionStorage.loadedFile = "true";
            sessionStorage.clear();
            setModalOpened(true);
          }}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <Plus />
            </ThemeIcon>
            <Text size="md">Add Table</Text>
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
          onClick={undo}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <ArrowBackUp />
            </ThemeIcon>
            <Text size="md">Undo</Text>
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
          onClick={redo}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <ArrowForwardUp />
            </ThemeIcon>
            <Text size="md">Redo</Text>
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
          onClick={screenshot}
        >
          <Group>
            <ThemeIcon
              variant="outline"
              color="dark"
              style={{ border: "2px solid white" }}
            >
              <Camera />
            </ThemeIcon>
            <Text size="md">Screenshot</Text>
          </Group>
        </UnstyledButton>
        <br />
        <br />
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <div style={{ fontSize: "24px", margin: "10px" }}>History</div>
        <hr />
        {history}
        {/* {historyComponent} */}
      </Navbar.Section>
    </Navbar>
  );
}
