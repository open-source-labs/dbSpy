//
// State Management for User and dbCredentials
//

import create from 'zustand';

const useCredentialsStore = create((set) => ({
  user: null,
  //username is a string
  setUser: (username) => set((state) => ({ ...state, user: username })),

  dbCredentials: {
    database_name: null,
    username: null,
    password: null,
    host: null,
    port: null,
  },
  //dbFormInput is an object
  setDbCredentials: (dbFormInput) =>
    set((state) => ({ ...state, dbFormInput })),
}));

export default useCredentialsStore;
