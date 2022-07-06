import React, { useState } from "react";
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  PasswordInput,
  Text,
  Drawer,
  useMantineTheme,
  MantineTheme,
  Loader,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Database, DatabaseImport } from "tabler-icons-react";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

interface SideBarProps {
  isLoading: boolean;
  isError: boolean;
  mutate: (data: object) => void;
  sideBarOpened: boolean;
  setSideBarOpened: (param: boolean) => void;
}

export default function Sidebar({ isLoading, isError, mutate, sideBarOpened, setSideBarOpened }: SideBarProps) {
  const form = useForm({
    initialValues: {
      hostname: "arjuna.db.elephantsql.com",
      username: "twvoyfda",
      password: "qsEqj2YTd-En5XI0Bv5kwvrp_S7TD7cR",
      port: "5432",
      database_name: "twvoyfda",
    },
  });
  // const [opened, setOpened] = useState(false);
  // const [sideBarOpened, setSideBarOpened] = useState(false);
  const theme = useMantineTheme();
  

  //USE QUERY FOR GET REQUEST
  //   const { data } = useQuery("initialschema");
  //   const { isLoading, error, data, refetch } = useQuery(
  //     "dogs",
  //     async () => {
  //       console.log("test");
  //       return axios("https://random.dog/woof.json");
  //     },
  //     { enabled: false }
  //   );
  // fetch("/api/getSchema", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((res) => res.json())
  //   .then((res) => console.log(res.data));
  //   if (isLoading) return <h1>Loading...</h1>;
  //   if (error) return <h1>Error</h1>;

  // USE MUTATION FOR POST REQUEST
  //   const { isLoading, mutate } = useMutation((dataToSend: object) => {
  //     console.log("logging data", dataToSend);
  //     return axios
  //       .post("/api/getSchema", dataToSend)
  //       .then((res) => setFetchedData(res.data));
  //   });

  //   if (isLoading) {
  //     return (
  //       <>
  //         <Box>
  //           <Loader />
  //           <Text>Loading your database... It will take couple of minutes</Text>;
  //         </Box>
  //       </>
  //     );
  //   }

  return (
    <>
      <Drawer
        position="right"
        overlayColor={
          theme.colorScheme === "dark"
            ? theme.colors.dark[9]
            : theme.colors.gray[2]
        }
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={sideBarOpened}
        onClose={() => setSideBarOpened(false)}
        title="Connect to Database"
        padding="xl"
        size="md"
      >
        <LoadingOverlay visible={isLoading} />

        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form
            onSubmit={form.onSubmit((values) => {
              mutate(values);
              form.setValues({
                hostname: "",
                username: "",
                password: "",
                port: "",
                database_name: "",
              });
            })}
          >
            <TextInput
              required
              data-autofocus
              label="Host"
              //   autoComplete="arjuna.db.elephantsql.com"
              //   placeholder="Host"
              {...form.getInputProps("hostname")}
            />
            <TextInput
              required
              label="Port"
              //   placeholder="Port"
              //   autoComplete="5432"
              {...form.getInputProps("port")}
            />
            <TextInput
              required
              label="Database Username"
              //   placeholder="Username"
              //   autoComplete="twvoyfda"
              {...form.getInputProps("username")}
            />
            <PasswordInput
              required
              label="Database Password"
              //   placeholder="Password"
              //   autoComplete="qsEqj2YTd-En5XI0Bv5kwvrp_S7TD7cR"
              {...form.getInputProps("password")}
            />
            <TextInput
              required
              label="Database Name"
              //   placeholder="Database name"
              //   autoComplete="twvoyfda"
              {...form.getInputProps("database_name")}
            />

            <Group position="right" mt="md">
              <Button type="submit">Connect</Button>
            </Group>
          </form>
        </Box>
      </Drawer>

      <Group position="right">
        {/* <Button
          //  variant="white" color="white"
          leftIcon={<DatabaseImport />}
          // styles={() => ({
          //   root: {
          //     marginRight: 30,
          //   },
          // })}
          onClick={() => setSideBarOpened(true)}
        >
          {buttonText}
        </Button> */}
      </Group>
    </>
  );
}
