class Store {
  store: Map<{}, {}>;
  ind: number;

  constructor() {
    this.store = new Map();
    this.ind = 0;
  }

  getData(data: {}) {
    this.store.set(this.ind, data);
    this.ind++;
    return this.store;
  }
}
const DataStore = new Store();
export default DataStore;
