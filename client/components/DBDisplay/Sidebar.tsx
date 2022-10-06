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
      hostname: "stampy.db.elephantsql.com",
      username: "zqygstdw",
      password: "VwEyJbq2-KoGt6mJJF73T-gS5WsgmDw-",
      port: "5432",
      database_name: "zqygstdw",
      database_link: "postgres://zqygstdw:VwEyJbq2-KoGt6mJJF73T-gS5WsgmDw-@stampy.db.elephantsql.com/zqygstdw"
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
                database_link: ""
              });
              setSideBarOpened(false);
            })}
          >
            <TextInput
              data-autofocus
              label="Host"
              {...form.getInputProps("hostname")}
            />
            <TextInput
              label="Port"
              {...form.getInputProps("port")}
            />
            <TextInput
              label="Database Username"
              {...form.getInputProps("username")}
            />
            <PasswordInput
              label="Database Password"
              {...form.getInputProps("password")}
            />
            <TextInput
              label="Database Name"
              {...form.getInputProps("database_name")}
            />
            <br></br>
            <TextInput
              label="OR Full Database Link"
              {...form.getInputProps("database_link")}
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
