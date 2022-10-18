// React & React Router & React Query Modules
import React, { useEffect, useState } from 'react';

// Components imported;
import DataStore from '../../Store';
import parseSql from '../../parse';
import { permissiveTableCheck } from '../../permissiveFn';

// UI Libraries - Mantine, tabler-icons
import { useForm } from '@mantine/form';
import {
  Text,
  UnstyledButton,
  Group,
  Modal,
  TextInput,
  Box,
  Button,
} from '@mantine/core';

import { 
  GridRowsProp, 
  GridRowModes,
  GridRowModesModel,
} from '@mui/x-data-grid';
import { randomId } from '@mui/x-data-grid-generator';

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
      tablename: '',
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
    const input = document.createElement('input');
    input.setAttribute('type', 'file');
    input.click();
    input.onchange = (e: any): void => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.readAsText(file);
      reader.onload = (event: any) => {
        //After the file is uploaded, we need to clear DataStore and clear out Query and Data from session Storage
        DataStore.clearStore();
        sessionStorage.removeItem('Query');
        sessionStorage.removeItem('Data');

        //Then, we will make loadedFile in DataStore and sessionStorage to true to render Canvas without "Disconnect to DB" and "Execute" buttons
        DataStore.loadedFile = true;
        sessionStorage.loadedFile = 'true';

        //Parse the .sql file into a data structure that is same as "fetchedData" and store it into a variable named "parsedData"
        const parsedData = parseSql(event.target.result);

        //Update DataStore data with parsedData and reset to an empty query
        DataStore.setData(parsedData);
        DataStore.setQuery([{ type: '', query: '' }]);

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

  interface EditToolbarProps {
    setRows: (newRows: (oldRows: GridRowsProp) => GridRowsProp) => void;
    setRowModesModel: (
      newModel: (oldModel: GridRowModesModel) => GridRowModesModel
    ) => void;
  }

    const firstcolumn = (props: EditToolbarProps) => {
      const { setRows, setRowModesModel } = props;
      const id = randomId();
      
      setRows(() => [
        {
          id,
          column: '',
          type: '',
          constraint: 'UNIQUE',
          pk: 'true',
          fk: '',
          reference: [],
          isNew: true,
        },
      ]);
    setRowModesModel((oldModel: GridRowModesModel) => ({
      [id]: { mode: GridRowModes.Edit, fieldToFocus: 'column' },
    }));
  }
//}

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
          className="button-FeatureTab"
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: '2px 10px',
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
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
          <Group className="group-FeatureTab">
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
    <>
    {/* <Navbar
      className="navbar-FeatureTab"
      width={{ base: 225 }}
      height={'100%'}
      p="xs"
    >
      <Modal
        className="modal-FeatureTab"
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
                  ['public.' + values.tablename]: {},
                }
              );

              if (result[0].errorMsg) {
                alert(result[0].errorMsg);
              } else {
                setTablename(values.tablename);
                setFetchedData({
                  ...fetchedData,
                  ['public.' + values.tablename]: {},
                });
                setModalOpened(false);
                DataStore.setData({
                  ...fetchedData,
                  ['public.' + values.tablename]: {},
                });
                DataStore.queryList.push(...result);
                DataStore.setQuery(DataStore.queryList.slice());
              }
              form.setValues({
                tablename: '',
              });
            })}
          >
            <TextInput
              required
              data-autofocus
              label="Table Name: "
              {...form.getInputProps('tablename')}
            />
            <Group position="right" mt="md">
              <Button
                styles={(theme) => ({
                  root: {
                    backgroundColor: '#3c4e58',
                    color: 'white',
                    border: 0,
                    height: 42,
                    paddingLeft: 20,
                    paddingRight: 20,
                    '&:hover': {
                      backgroundColor: theme.fn.darken('#2b3a42', 0.1),
                    },
                  },
                })}
                type="submit"
              >
                Create
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>

      <Navbar.Section>
        <div
          className="FeatureTab-Navbar"
        >
          Action
        </div>
        <hr />

        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={() => {
            if (DataStore.connectedToDB) {
              sessionStorage.clear();
              DataStore.disconnect1();
              setSideBarOpened(true);
            } else setSideBarOpened(true);
          }}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
            >
              <DatabaseImport />
            </ThemeIcon>
            <Text size="md">Connect Database</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={() => {
            if (DataStore.connectedToDB) {
              alert('Please disconnect your database first.');
            } else uploadSQL();
          }}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
            >
              <FileUpload />
            </ThemeIcon>
            <Text size="md">Upload SQL File </Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={() => {
            if (DataStore.connectedToDB) {
              alert('Please disconnect your database first.');
              return;
            } else if (DataStore.loadedFile) {
              alert('Please clear the canvas first.');
              return;
            } else {
              DataStore.loadedFile = true;
              sessionStorage.loadedFile = 'true';
              setModalOpened(true);
            }
          }}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
            >
              <File />
            </ThemeIcon>
            <Text size="md">Build Database</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={() => {
            if (DataStore.connectedToDB) {
              alert('Please disconnect your database first.');
              return;
            } else if (DataStore.loadedFile) {
              sessionStorage.clear();
              DataStore.loadedFile = false;
              location.reload();
            }
          }}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
            >
              <Eraser />
            </ThemeIcon>
            <Text size="md">Clear Canvas</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={() => alert('Feature coming soon!')}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
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
        <div
          className="FeatureTab-NavBar" 
        >
          Edit
        </div>{' '}
        <hr />
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={() => {
            DataStore.loadedFile = true;
            sessionStorage.loadedFile = 'true';
            sessionStorage.clear();
            setModalOpened(true);
          }}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
            >
              <Plus />
            </ThemeIcon>
            <Text size="md">Add Table</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={undo}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
            >
              <ArrowBackUp />
            </ThemeIcon>
            <Text size="md">Undo</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={redo}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
            >
              <ArrowForwardUp />
            </ThemeIcon>
            <Text size="md">Redo</Text>
          </Group>
        </UnstyledButton>
        <UnstyledButton
          sx={(theme) => ({
            display: 'block',
            width: '100%',
            padding: theme.spacing.xs,
            borderRadius: theme.radius.sm,
            color:
              theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

            '&:hover': {
              backgroundColor:
                theme.colorScheme === 'dark'
                  ? theme.colors.dark[6]
                  : theme.colors.gray[0],
            },
          })}
          onClick={screenshot}
        >
          <Group>
            <ThemeIcon
              className="FeatureTab-ThemeIcon"
              variant="outline"
              color="dark"
            >
              <Camera />
            </ThemeIcon>
            <Text size="md">Screenshot</Text>
          </Group>
        </UnstyledButton>
        <br />
        <br />
      </Navbar.Section>
      <Navbar.Section
        className="FeatureTab-Navbar"
        grow
        component={ScrollArea}
        mx="-xs"
        px="xs"
      >
        <div>History</div>
        <hr />
        {history}
      </Navbar.Section>
    </Navbar> */}
  <Modal
        className="modal-FeatureTab"
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
                  ['public.' + values.tablename]: {},
                }
              );

              if (result[0].errorMsg) {
                alert(result[0].errorMsg);
              } else {
                setTablename(values.tablename);
                setFetchedData({
                  ...fetchedData,
                  ['public.' + values.tablename]: {},
                });
                setModalOpened(false);
                DataStore.setData({
                  ...fetchedData,
                  ['public.' + values.tablename]: {},
                });
                DataStore.queryList.push(...result);
                DataStore.setQuery(DataStore.queryList.slice());
              }
              form.setValues({
                tablename: '',
              });
            })}
          >
            <TextInput
              required
              data-autofocus
              label="Table Name: "
              {...form.getInputProps('tablename')}
            />
            <Group position="right" mt="md">
              <Button
                styles={(theme) => ({
                  root: {
                    backgroundColor: '#3c4e58',
                    color: 'white',
                    border: 0,
                    height: 42,
                    paddingLeft: 20,
                    paddingRight: 20,
                    '&:hover': {
                      backgroundColor: theme.fn.darken('#2b3a42', 0.1),
                    },
                  },
                })}
                type="submit"
              >
                Create
              </Button>
            </Group>
          </form>
        </Box>
      </Modal>

    <div className="max-w-2xl mx-auto">

    <aside className="w-64" aria-label="Sidebar">
      <div className="px-3 py-4 overflow-y-auto rounded bg-gray-50 dark:bg-gray-800 menuBar">
        <p className='text-slate-900 dark:text-white'>Action</p>
        <hr />
        <ul className="space-y-2">
          <li>
            <a 
              onClick={() => {
                if (DataStore.connectedToDB) {
                  sessionStorage.clear();
                  DataStore.disconnect1();
                  setSideBarOpened(true);
                } else setSideBarOpened(true);
              }}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 011.242 7.244l-4.5 4.5a4.5 4.5 0 01-6.364-6.364l1.757-1.757m13.35-.622l1.757-1.757a4.5 4.5 0 00-6.364-6.364l-4.5 4.5a4.5 4.5 0 001.242 7.244" />
              </svg>
              <span className="ml-3">Connect Database</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                if (DataStore.connectedToDB) {
                  alert('Please disconnect your database first.');
                } else uploadSQL();
              }}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m6.75 12l-3-3m0 0l-3 3m3-3v6m-1.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Upload SQL File</span>
              <span className="inline-flex items-center justify-center px-2 ml-3 text-sm font-medium text-gray-800 bg-gray-200 rounded-full dark:bg-gray-700 dark:text-gray-300"></span>
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                if (DataStore.connectedToDB) {
                  alert('Please disconnect your database first.');
                  return;
                } else if (DataStore.loadedFile) {
                  alert('Please clear the canvas first.');
                  return;
                } else {
                  DataStore.loadedFile = true;
                  sessionStorage.loadedFile = 'true';
                  setModalOpened(true);
                }
              }}
              className=" cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Build Database</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => {
                if (DataStore.connectedToDB) {
                  alert('Please disconnect your database first.');
                  return;
                } else if (DataStore.loadedFile) {
                  sessionStorage.clear();
                  DataStore.loadedFile = false;
                  location.reload();
                }
              }}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
              >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Clear Canvas</span>
            </a>
          </li>
          <li>
            <a
              onClick={() => alert('Feature coming soon!')}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0120.25 6v12A2.25 2.25 0 0118 20.25H6A2.25 2.25 0 013.75 18V6A2.25 2.25 0 016 3.75h1.5m9 0h-9" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Save</span>
            </a>
          </li>
          <br />
          <p className='text-slate-900 dark:text-white'>Edit</p>
          <hr />
          <li>
            <a
              onClick={() => {
                DataStore.loadedFile = true;
                sessionStorage.loadedFile = 'true';
                sessionStorage.clear();
                setModalOpened(true);
              }}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13.5 16.875h3.375m0 0h3.375m-3.375 0V13.5m0 3.375v3.375M6 10.5h2.25a2.25 2.25 0 002.25-2.25V6a2.25 2.25 0 00-2.25-2.25H6A2.25 2.25 0 003.75 6v2.25A2.25 2.25 0 006 10.5zm0 9.75h2.25A2.25 2.25 0 0010.5 18v-2.25a2.25 2.25 0 00-2.25-2.25H6a2.25 2.25 0 00-2.25 2.25V18A2.25 2.25 0 006 20.25zm9.75-9.75H18a2.25 2.25 0 002.25-2.25V6A2.25 2.25 0 0018 3.75h-2.25A2.25 2.25 0 0013.5 6v2.25a2.25 2.25 0 002.25 2.25z" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Add Table</span>
            </a>
          </li>
          <li>
            <a
              onClick={undo}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Undo</span>
            </a>
          </li>
          <li>
            <a
              onClick={redo}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Redo</span>
            </a>
          </li>
          <li>
            <a
              onClick={screenshot}
              className="cursor-pointer flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
              </svg>
              <span className="flex-1 ml-3 whitespace-nowrap">Screenshot</span>
            </a>
          </li>
        </ul>
        <br />
        <div className='historyBlock'>
          <p className='text-slate-900 dark:text-white'>History</p>
          <hr />
          {history}
        </div>
      </div>
    </aside>
  </div>
  </>
  );
}