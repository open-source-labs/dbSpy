import React, { useState } from "react";
import {
  TextInput,
  Checkbox,
  Button,
  Group,
  Box,
  PasswordInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { useQuery, useMutation, useQueryClient } from "react-query";
import axios from "axios";

export default function Sidebar() {
  const form = useForm({
    initialValues: {
      host: "",
      dbUsername: "",
      dbPassword: "",
      port: "",
      databaseName: "",
    },
  });

  //   const { data } = useQuery("initialschema");

  const { isLoading, error, data, refetch } = useQuery(
    "dogs",
    async () => {
      console.log("test");
      return axios("https://random.dog/woof.json");
    },
    { enabled: false }
  );

  // fetch("/api/getSchema", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify(data),
  // })
  //   .then((res) => res.json())
  //   .then((res) => console.log(res.data));
  if (isLoading) return <h1>Loading...</h1>;
  if (error) return <h1>Error</h1>;

  return (
    <Box sx={{ maxWidth: 300 }} mx="auto">
      <form
        onSubmit={form.onSubmit((values) => {
          console.log(values);
          form.getInputProps("host").value = "";
          refetch();
        })}
      >
        <TextInput
          required
          // label="Host"
          placeholder="Host"
          {...form.getInputProps("host")}
        />
        <TextInput
          required
          // label="Port"
          placeholder="Port"
          {...form.getInputProps("port")}
        />
        <TextInput
          required
          // label="DB Username"
          placeholder="Username"
          {...form.getInputProps("dbUsername")}
        />
        <PasswordInput
          required
          // label="DB Password"
          placeholder="Password"
          {...form.getInputProps("dbPassword")}
        />
        <TextInput
          required
          // label="DB Name"
          placeholder="Database name"
          {...form.getInputProps("databaseName")}
        />

        <Group position="right" mt="md">
          <Button type="submit">Submit</Button>
        </Group>
      </form>
    </Box>
  );
}
