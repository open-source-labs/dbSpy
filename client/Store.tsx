
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

  //   dbConnect();

  //   dbDisconnet();
}

const DataStore = new Store();
export default DataStore;
