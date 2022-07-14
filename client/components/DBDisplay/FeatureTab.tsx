// React & React Router & React Query Modules
import React, { useEffect, useState } from "react";
import { useForm } from "@mantine/form";
import DataStore from "../../Store";
import parseSql from "../../parse";

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
  Input,
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

import { permissiveTableCheck } from "../../permissiveFn";

interface FeatureTabProps {
  setTablename: (e: string) => void;
  fetchedData: {};
  setFetchedData: (e: {}) => void;
  historyClick: number;
  setHistoryClick: (click: number) => void;
}

export default function FeatureTab({
  setTablename,
  setFetchedData,
  fetchedData,
  historyClick,
  setHistoryClick,
}: FeatureTabProps) {
  const [modalOpened, setModalOpened] = useState(false);
  const form = useForm({
    initialValues: {
      tablename: "",
    },
  });

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
          setHistoryClick(historyClick + 1);
          setFetchedData(data);
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

  return (
    <Navbar width={{ base: 225 }} height={"100%"} p="xs">
      {/* <Navbar.Section>LOGO</Navbar.Section> */}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title="Type new table name: "
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

              if (result[0].status) {
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

              console.log(
                "DataStore.store after creation of table",
                DataStore.store
              );
              console.log(
                "DataStore.queries after creation of table",
                DataStore.queries
              );

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

      <Navbar.Section>
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
        {/* <UnstyledButton
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
        </UnstyledButton> */}
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
            const input = document.createElement("input");
            input.setAttribute("type", "file");
            input.click();
            input.onchange = (e: any): void => {
              const file = e.target.files[0];
              const reader = new FileReader();
              reader.readAsText(file);
              reader.onload = (event: any) => {
                DataStore.connectedToDB = true;
                setFetchedData(parseSql(event.target.result));
              };
            };
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
            <Text size="md">LOAD SQL FILE </Text>
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
      <br />
      <br />
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
          onClick={() => {
            DataStore.connect();
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
        <br />
        <br />
      </Navbar.Section>
      <Navbar.Section grow component={ScrollArea} mx="-xs" px="xs">
        <div style={{ fontSize: "24px", margin: "10px" }}>HISTORY</div>
        <hr />
        {historyComponent}
        {/* {historyComponent} */}
      </Navbar.Section>
    </Navbar>
  );
}
