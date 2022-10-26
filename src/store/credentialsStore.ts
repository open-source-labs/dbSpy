//
// State Management for User and dbCredentials
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';

let credentialsStore = (set) => ({
  //user state
  user: null,
  //user
  setUser: (userObject) => set((state) => ({ ...state, user: userObject })),

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
