class Store {
  store: Map<{}, {}>;
  ind: number;
  connectedToDB: boolean;
  // queries: string[];

  constructor() {
    this.store = new Map();
    this.ind = 0;
    this.connectedToDB = false;
    // this.queries = [];
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
    this.store.clear();
  }
}

const DataStore = new Store();
// DataStore.connect()
// console.log(DataStore)
// DataStore.disconnect()
// console.log(DataStore)
export default DataStore;
