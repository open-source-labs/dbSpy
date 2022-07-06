class Store {
  store: Map<{}, {}>;
  ind: number;
  connectedToDB: boolean;

  constructor() {
    this.store = new Map();
    this.ind = 0;
    this.connectedToDB = false;
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
  }
}

const DataStore = new Store();
// DataStore.connect()
// console.log(DataStore)
// DataStore.disconnect()
// console.log(DataStore)
export default DataStore;
