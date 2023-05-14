"use strict";
//
// State Management for User and dbCredentials
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
let credentialsStore = (set) => ({
    //user state
    user: null,
    //user
    setUser: (userObject) => set((state) => ({ ...state, user: userObject })),
    //dbCredentials state
    dbCredentials: {},
    //dbFormInput is an object
    setDbCredentials: (dbFormInput) => set((state) => ({ ...state, dbCredentials: dbFormInput })),
});
const useCredentialsStore = (0, zustand_1.default)((0, middleware_1.persist)((0, middleware_1.devtools)(credentialsStore)));
exports.default = useCredentialsStore;
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
//# sourceMappingURL=credentialsStore.js.map