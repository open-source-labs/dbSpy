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
      hostname: "castor.db.elephantsql.com",
      username: "vjcmcaut",
      password: "wcc8BHXNjyN4exqfuQVPzpdeOBJimLfg",
      port: "5432",
      database_name: "vjcmcaut",
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

            <Group position="center" mt="md">
              <Button color="dark" size="md" compact type="submit">
                Connect
              </Button>
            </Group>
          </form>
        </Box>
      </Drawer>

      {/* <Group position="right"> */}
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
      {/* </Group> */}
    </>
  );
}
