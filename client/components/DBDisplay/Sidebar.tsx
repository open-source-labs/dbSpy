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
  MantineTheme
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { Database } from 'tabler-icons-react';
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

interface SideBarProps {
  fetchedData: object;
  setFetchedData: (fetchedData: object) => void;
  isLoading: boolean;
  isError: boolean;
  mutate: (data: object) => void;
}

export default function Sidebar({
  fetchedData,
  setFetchedData,
  isLoading,
  isError,
  mutate,
}: SideBarProps) {
  const form = useForm({
    initialValues: {
      hostname: "",
      username: "",
      password: "",
      port: "",
      database_name: "",
    },
  });
  const [opened, setOpened] = useState(false);
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
  console.log(fetchedData);

  if (isLoading) {
    return <Text>Loading your database... It will take couple of minutes</Text>;
  }

  return (
    <>
      <Drawer
        position="right"
        overlayColor={theme.colorScheme === 'dark' ? theme.colors.dark[9] : theme.colors.gray[2]}
        overlayOpacity={0.55}
        overlayBlur={3}
        opened={opened}
        onClose={() => setOpened(false)}
        title="Connect to database"
        padding="xl"
        size="md"
      >
    
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
              //   placeholder="Host"
              {...form.getInputProps("hostname")}
            />
            <TextInput
              required
              label="Port"
              //   placeholder="Port"
              {...form.getInputProps("port")}
            />
            <TextInput
              required
              label="Database Username"
              //   placeholder="Username"
              {...form.getInputProps("username")}
            />
            <PasswordInput
              required
              label="Database Password"
              //   placeholder="Password"
              {...form.getInputProps("password")}
            />
            <TextInput
              required
              label="Database Name"
              //   placeholder="Database name"
              {...form.getInputProps("database_name")}
            />

            <Group position="right" mt="md">
              <Button type="submit">Connect</Button>
            </Group>
          </form>
        </Box>
    </Drawer>

    <Group position="right">
      <Button 
      //  variant="white" color="white"
        leftIcon={<Database />}
        styles={() => ({
          root: {
            marginRight: 30
          }
        })}
        onClick={() => setOpened(true)}>Connect to database</Button>
    </Group>
    </>
  );
}
