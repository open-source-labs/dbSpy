import React from "react";
import {
  Select,
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
import { session } from "passport";
import useCredentialsStore from '../../store/credentialsStore';

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
  //STATE DECLARATION (dbSpy3.0)
  const user = useCredentialsStore(state => state.user);
  const setUser = useCredentialsStore(state => state.setUser);
  const dbCredentials = useCredentialsStore(state => state.dbCredentials);
  const setDbCredentials = useCredentialsStore(state => state.setDbCredentials);
  //END: STATE DECLARATION

  const form = useForm({
    initialValues: {
      db_type: "PostgreSQL",
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
              if (values.database_link.length > 0){
                const fullLink = values.database_link;
                const splitURI = fullLink.split('/');
                const name = splitURI[3];
                const internalLinkArray = splitURI[2].split(':')[1].split('@');
                values.hostname = internalLinkArray[1];
                values.username = name;
                values.password = internalLinkArray[0];
                values.port = '5432';
                values.database_name = name;
              }
              // grabbing userDBInfo from values to send to server to make db changes
              if (DataStore.connectedToDB === true) {
                sessionStorage.clear();
                DataStore.disconnect1();
              }
              DataStore.userDBInfo = values;
              sessionStorage.userDBInfo = JSON.stringify(values);
              mutate(values);
              form.setValues({
                db_type: "",
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
            <Select 
              label="Select your database"
              placeholder="Pick one"
              data={['PostgreSQL', 'mySQL']}
              {...form.getInputProps("db_type")}
            />
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
            <br></br>
            <button type="submit">Connect</button>
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
