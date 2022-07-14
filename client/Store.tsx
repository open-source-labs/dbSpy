/* Global State: Store - class object*/
class Store {
  store: Map<{}, {}>;
  ind: number;
  loadedFile: boolean;
  connectedToDB: boolean;
  userDBInfo: object;
  queryInd: number;
  queries: Map<{}, {}[]>;
  queryList: {}[];

  /* Description for each global state:
  Manages seven states globally:
  1. store - a Map object that tracks all the changes in the db model tables
    {      
      this.ind: {
        table_name: {
          field_name: {
            IsForeignKey: boolean;
            IsPrimaryKey: boolean;
            Name: string;
            References: any[];
            TableName: string;
            Value: any;
            additional_constraints: string | null;
            data_type: string;
            field_name: string;
          };
        };
      };
    }

  2. ind - a serial "key" for store Map object; increments by 1 from 0;
  3. queries - a Map object that tracks the "history" of the list of queries to be operated for database migration;
    {      
      this.queryInd: this.queryList
    }

  4. queryList - an array that contains the list of queries in object form with "type" and "query" properties; It gets updated upon any changes made to the table
    [
      {
        type: ""
        query: ""
      }
    ]
  5. queryInd - a serial "key" for queries Map object; increments by 1 from 0
  6. connectedToDB - boolean that tracks if the user is connected to its database
  7. userDBInfo - an object that contains database credentials that needs to be sent for database migration
  */
  constructor() {
    this.store = new Map();
    this.ind = 0;

    this.queries = new Map();
    this.queryList = [];
    this.queryInd = 0;

    this.loadedFile = false;
    this.connectedToDB = false;
    this.userDBInfo = {};
  }

  /* 
  "setData" - a method that logs table model data into "store" Map object
  */
  setData(data: {}) {
    this.store.set(this.ind, data);
    this.ind++;
    return this.store;
  }

  /* 
  "getData" - a method that gets table model data from "store" Map object
  */
  getData(ind: number) {
    return this.store.get(ind);
  }

  /* 
  "setQuery" - a method that logs query data into "queries" Map object
  */
  setQuery(data: {}[]) {
    this.queries.set(this.queryInd, data);
    this.queryInd++;
    return this.queries;
  }

  /* 
  "getQuery" - a method that gets query data into "queries" Map object
  */
  getQuery(ind: number) {
    return this.queries.get(ind);
  }

  /* 
  "connect" - a method that sets connectedToDB to "true"
  */
  connect() {
    this.connectedToDB = true;
  }

  /* 
  "disconnect" - a method that sets connectedToDB to "false"
  */
  disconnect() {
    this.connectedToDB = false;
    location.reload();
  }

  /* 
  "clearStore" - a method that clears up states in Store.tsx
  */
  clearStore() {
    this.store.clear();
    this.queries.clear();
    this.ind = 0;
    this.queryInd = 0;
    this.queryList = [];
  }
}

//instance of Store object and assign it to "DataStore"
const DataStore = new Store();
export default DataStore;
