<<<<<<< HEAD
import React from "react";
import { useNavigate } from "react-router";
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
import axios from "axios";
import useCredentialsStore from '../../store/credentialsStore';
import useSchemaStore from '../../store/schemaStore';
import createInitialEdges from '../ReactFlow/Edges';
import createInitialNodes from '../ReactFlow/Nodes';

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
  const navigate = useNavigate();
  //STATE DECLARATION (dbSpy3.0)
  const setSchemaStore = useSchemaStore(state => state.setSchemaStore);
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
  form.onSubmit((values) => {
              if (values.database_link.length > 0){
=======
// React & React Router & React Query Modules;
import React, {useState} from 'react';
import axios from 'axios';

// Components Imported;
import useCredentialsStore from '../../store/credentialsStore';
import useSchemaStore from '../../store/schemaStore';
import useFlowStore from '../../store/flowStore';
import createInitialEdges from '../../components/ReactFlow/Edges';
import createInitialNodes from '../../components/ReactFlow/Nodes';

const Sidebar = (props:any) => {
//STATE DECLARATION (dbSpy3.0)
  const setDbCredentials = useCredentialsStore((state)=> state.setDbCredentials);
  const setSchemaStore = useSchemaStore((state) => state.setSchemaStore);
  const setEdges = useFlowStore((state) => state.setEdges);
  const setNodes = useFlowStore((state) => state.setNodes);
  //END: STATE DECLARATION

  //HELPER FUNCTIONS
  const handleSubmit = async (e:any) => {
    e.preventDefault();
    const values:any = formValues;
    if (values.database_link){
>>>>>>> 24461c059ddec16372f94e559d40a87cc24c7662
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
<<<<<<< HEAD
              
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
            })


  const theme = useMantineTheme();

  //getSchema API function
  const getSchema = async (dbInfo: any) => {
      let endpoint: string = '/api/getSchema';
      //check if postgres or mySQL
      switch (dbInfo.db_type) {
        case 'PostgreSQL':
          endpoint = '/api/getSchema';
          break;
        case 'mySQL':
          endpoint = '/apimysql/getSchema';
          break;
      }
      //fetch call to back-end
      const dbSchema = await axios.post(endpoint, dbInfo).then((res) => res.data);
      setSchemaStore(dbSchema);
      createInitialEdges();
      createInitialNodes();
    };


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
            onSubmit={(values)=>{
              setDbCredentials(values);
              getSchema(values);
            }}
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

            <Group position="center" mt="md">
              <Button 
                styles={(theme) => ({
                  root: {
                    backgroundColor: "gray",
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
=======
    //update dbCredentials
    setDbCredentials(values);

    //check db_type
    let endpoint: string = '/api/getSchema';
      //check if postgres or mySQL
      switch (values.db_type) {
        case 'PostgreSQL':
          endpoint = '/api/getSchema';
          break;
        case 'MySQL':
          endpoint = '/apimysql/getSchema';
          break;
      }
    console.log('endpoint', endpoint, '&values', values);
    //api call
    const dbSchema = await axios.post(endpoint, values)
      .then((res) => res.data)
      .catch((err)=>console.log('getSchema error', err));
    //update schemaStore
    setSchemaStore(dbSchema);
    const initialEdges = createInitialEdges(dbSchema);
    setEdges(initialEdges);
    const initialNodes = createInitialNodes(dbSchema, initialEdges);
    setNodes(initialNodes);
    props.closeNav();
  };

  //END: HELPER FUNCTIONS

  //form state hooks
  const [formValues, setFormValues] = useState({});

  return (        
      <div id='dbconnect'>
        <label><h3>Connect to Database</h3></label>
        <span className='form-item'>
        <label htmlFor="db_type">Database Type</label>
        <select className='form-box' id='db_type' name='db_type' onChange={(e)=>setFormValues({...formValues, db_type: e.target.value})} >
          <option value='PostgreSQL'>PostgreSQL</option>
          <option value='MySQL'>MySQL</option>
        </select>
        </span>
        <span className='form-item'>
        <label htmlFor="database_link">Full Database Link</label>
        <input className='form-box' type='text' id='database_link 'name='database_link'  onChange={(e)=>setFormValues({...formValues, database_link: e.target.value})} />
        </span>
        <span className='form-item'>
        <label htmlFor="hostname">Host</label>
        <input className='form-box' type='text' id='hostname' name='hostname'  onChange={(e)=>setFormValues({...formValues, hostname: e.target.value})} />
        </span>
        <span className='form-item'>
        <label htmlFor="port">Port</label>
        <input className='form-box' type='text' id='port' name='port'  onChange={(e)=>setFormValues({...formValues, port: e.target.value})} />
        </span>
        <span className='form-item'>
        <label htmlFor="username">Database Username</label>
        <input className='form-box' type='text' id='username' name='username'  onChange={(e)=>setFormValues({...formValues, username: e.target.value})} />
        </span>
        <span className='form-item'>
        <label htmlFor="password">Database Password</label>
        <input className='form-box' type='text' id='password' name='password'  onChange={(e)=>setFormValues({...formValues, password: e.target.value})} />
        </span>
        <span className='form-item'>
        <label htmlFor="database_name">Database Name</label>
        <input className='form-box' type='text' id='database_name 'name='database_name'  onChange={(e)=>setFormValues({...formValues, database_name: e.target.value})} />
        </span>
        <button className='form-button' id='submit' onClick={((e)=>handleSubmit(e))} >Connect</button>
      </div>
  )

};

export default Sidebar;
>>>>>>> 24461c059ddec16372f94e559d40a87cc24c7662
