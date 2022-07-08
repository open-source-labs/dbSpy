class Store {
  store: Map<{}, {}>;
  ind: number;
  connectedToDB: boolean;
  userDBInfo: object;
  queryInd: number;
  queries: Map<{}, {}[]>;
  queryList: {}[];

  constructor() {
    this.store = new Map();
    this.ind = 0;
    this.connectedToDB = false;
    this.userDBInfo = {};
    this.queryInd = 0;
    this.queries = new Map();
    this.queryList = [];
  }

  getData(data: {}) {
    this.store.set(this.ind, data);
    this.ind++;
    return this.store;
  }

  connect() {
    this.connectedToDB = true;
  }

  disconnect() {
    this.connectedToDB = false;
    location.reload();
  }

  clearQueries() {
    // this.store.clear();
    // this.queries = [];
  }

  getQuery(data: {}[]) {
    this.queries.set(this.queryInd, data);
    this.queryInd++;
    return this.queries;
  }
}

const DataStore = new Store();
// DataStore.connect()
// console.log(DataStore)
// DataStore.disconnect()
// console.log(DataStore)
export default DataStore;
