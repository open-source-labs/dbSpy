import React from "react";
import {
  TextInput,
  Button,
  Group,
  Box,
  PasswordInput,
  Drawer,
  useMantineTheme,
  LoadingOverlay,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import DataStore from "../../Store";

interface SideBarProps {
  isLoadingProps: boolean;
  isErrorProps: boolean;
  mutate: (data: object) => void;
  sideBarOpened: boolean;
  setSideBarOpened: (param: boolean) => void;
}

export default function Sidebar({
  isLoadingProps,
  isErrorProps,
  mutate,
  sideBarOpened,
  setSideBarOpened,
}: SideBarProps) {
  const form = useForm({
    initialValues: {
      hostname: "salt.db.elephantsql.com",
      username: "gipvrrdm",
      password: "fc_XSr9BrbQeusyrEoBk8omZrb4qsT1v",
      port: "5432",
      database_name: "gipvrrdm",
    },
  });

  const theme = useMantineTheme();

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
        title="Connect Database"
        padding="xl"
        size="md"
      >
        <LoadingOverlay visible={isLoadingProps} />

        <Box sx={{ maxWidth: 300 }} mx="auto">
          <form
            onSubmit={form.onSubmit((values) => {
              // grabbing userDBInfo from values to send to server to make db changes
              if (DataStore.connectedToDB === true) {
                sessionStorage.clear();
                DataStore.disconnect1();
              }
              DataStore.userDBInfo = values;
              sessionStorage.userDBInfo = JSON.stringify(values);
              mutate(values);
              form.setValues({
                hostname: "",
                username: "",
                password: "",
                port: "",
                database_name: "",
              });
              setSideBarOpened(false);
            })}
          >
            <TextInput
              required
              data-autofocus
              label="Host"
              {...form.getInputProps("hostname")}
            />
            <TextInput
              required
              label="Port"
              {...form.getInputProps("port")}
            />
            <TextInput
              required
              label="Database Username"
              {...form.getInputProps("username")}
            />
            <PasswordInput
              required
              label="Database Password"
              {...form.getInputProps("password")}
            />
            <TextInput
              required
              label="Database Name"
              {...form.getInputProps("database_name")}
            />

            <Group position="center" mt="md">
              <Button 
                styles={(theme) => ({
                  root: {
                    backgroundColor: "#3c4e58",
                    color: "white",
                    border: 0,
                    height: 42,
                    paddingLeft: 20,
                    paddingRight: 20,
                    "&:hover": {
                      backgroundColor: theme.fn.darken("#2b3a42", 0.1),
                    },
                  },
                })}
                size="md"
                compact type="submit">
                Connect
              </Button>
            </Group>
          </form>
        </Box>
      </Drawer>
    </>
  );
}
