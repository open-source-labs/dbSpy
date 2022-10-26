//
// State Management for User and dbCredentials
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
//typescript imports
// import { credentialsTypes } from './storeTypes';
import { set } from './storeTypes'
import { dbForm } from './storeTypes'

interface credentialsTypes {
  database_name: string | null,
  username: string | null,
  password: string | null,
  host: string | null,
  port: number | null
 }

let credentialsStore = (set: string | null) => ({
  //user state
  user: null,
  //username is a string
  setUser: (username: string | null) => set((state: set) => ({ ...state, user: username })),

  //dbCredentials state
  dbCredentials: null,
  //dbFormInput is an object
  setDbCredentials: (dbFormInput: dbForm) =>
    set((state: string | null) => ({ ...state, dbCredentials: dbFormInput })),
});

credentialsStore = devtools(credentialsStore);
credentialsStore = persist(credentialsStore);
const useCredentialsStore = create(credentialsStore);

export default useCredentialsStore;

// Here is the shape of dbCredentials state
// {
//  database_name: null,
//  username: null,
//  password: null,
//  host: null,
//  port: null
// }


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