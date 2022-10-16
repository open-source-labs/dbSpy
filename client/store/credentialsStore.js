//
// State Management for User and dbCredentials
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let credentialsStore = (set) => ({
  //user state
  user: null,
  //username is a string
  setUser: (username) => set((state) => ({ ...state, user: username })),

  //dbCredentials state
  dbCredentials: null,
  //dbFormInput is an object
  setDbCredentials: (dbFormInput) =>
    set((state) => ({ ...state, dbCredentials: dbFormInput })),
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
