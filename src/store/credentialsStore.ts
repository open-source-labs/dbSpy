//* State Management for User and dbCredentials
//
//-- This file sets up a global state using Zustand
//-- stores and shares the logged-in user credentials
//-- create is a function from Zustand that lets you make a store (backpack) for the apps memory
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { dbCredentials } from '@/Types';

//-- set function (provided by Zustand) updates the store
let credentialsStore = (
  set: (
    arg0: { (state: any): any; (state: any): any },
    arg1?: boolean,
    arg2?: string
  ) => any
) => ({
  //-- stores current user info, starts as null
  user: null,
  //-- updates the user state
  setUser: (userObject: any) =>
    set(
      (state: any) => ({ ...state, user: userObject }),
      false,
      'setUser in /credentialsStore'
    ),

  //-- updates the dbCredentials state
  dbCredentials: {} as dbCredentials,
  //dbFormInput is an object
  setDbCredentials: (dbFormInput: any) =>
    //-- how app knows what database it's connecting to
    set(
      (state: any) => ({ ...state, dbCredentials: dbFormInput }),
      false,
      'setDbCredentials in /credentialsStore'
    ),
});

//-- creates the Zustand store
//-- able to use useCredentialsStore() in any component to access user or dbCredentials
const useCredentialsStore = create(devtools(credentialsStore));

export default useCredentialsStore;

/* Here is the shape of dbCredentials state:
  {
    database_name: null,
    username: null,
    password: null,
    host: null,
    port: null
    database_link: null,
    database_name: null
  }
*/

/* Here is the typing of dbCredentials state:
  {
    database_name: string|number|null;
    username: string|number|null;
    password: string|number|null;
    hostname: string|number|null;
    port: string|number|null;
    database_link: string|number|null;
    db_type: string;
  }
*/

//Example usage in component:
// 1. Import the file:
//      useCredentialsStore from './store/credentialsStore';
// 2. To access the 'user' state, declare inside the component function:
//      const user = useCredentialsStore(state => state.user);
// 3. To access the 'setUser' hook:
//      const setUser = useCredentialsStore(state => state.setUser);
// 4. You can invoke the 'setUser' hook directly or make it part of a function.
//      For example: const submit = (e) => setUser(e.target.event);
//
