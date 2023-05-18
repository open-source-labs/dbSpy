//
// State Management for User and dbCredentials
//

import create from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import {dbCredentials} from  '../Types';


let credentialsStore = (set: (arg0: { (state: any): any; (state: any): any; }) => any) => (
  {
  //user state
  user: null,
  //user
  setUser: (userObject: any) => set((state: any) => ({ ...state, user: userObject })),



  //dbCredentials state
  dbCredentials: {} as dbCredentials,
  //dbFormInput is an object
  setDbCredentials: (dbFormInput: any) =>
    set((state: any) => ({ ...state, dbCredentials: dbFormInput })),
});


const useCredentialsStore = create(persist(devtools(credentialsStore)))

export default useCredentialsStore;

// Here is the shape of dbCredentials state
// {
//  database_name: null,
//  username: null,
//  password: null,
//  host: null,
//  port: null
//  database_link: null,
//  database_name: null
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
