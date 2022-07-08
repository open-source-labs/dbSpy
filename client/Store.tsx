class Store {
  store: Map<{}, {}>;
  ind: number;
  connectedToDB: boolean;
  queries: string[];
  userDBInfo: object;

  constructor() {
    this.store = new Map();
    this.ind = 0;
    this.connectedToDB = false;
    this.queries = [];
    this.userDBInfo = {};
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
    this.queries = [];
  }
}

const DataStore = new Store();
// DataStore.connect()
// console.log(DataStore)
// DataStore.disconnect()
// console.log(DataStore)
export default DataStore;
