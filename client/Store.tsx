class Store {
  store: Map<{}, {}>;
  ind: number;

  constructor() {
    this.store = new Map();
    this.ind = 0;
  }

  getData(data: {}) {
    // if url key doesn't exist in map, create and store new promise
    this.store.set(this.ind, data);

    // remove this `then()` and all `message` references in production code
    // just do `return promise`
    this.ind++;
    return this.store;
  }
}
// export this to use it anywhere in app
const DataStore = new Store();
console.log("this is from data store", DataStore);
// export default DataStore
export default DataStore;
