"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
const useDataStore = (0, zustand_1.default)()(
// subscribeWithSelector middleware allows components (e.g., Flow.tsx) to listen for changes in store
(0, middleware_1.subscribeWithSelector)(
// devtools middleware allows use of Redux devtool in chrome
(0, middleware_1.devtools)((set) => ({
    referenceStore: {},
    dataStore: {},
    system: 'PostgreSQL',
    setSystem: (system) => set((state) => ({ ...state, system })),
    setDataStore: (dataInfo) => set((state) => ({ ...state, dataStore: dataInfo })),
    deleteTableData: (tableName) => set((state) => {
        const newState = { ...state };
        delete newState.dataStore[tableName];
        return newState;
    }),
    setReferencesStore: (dataInfo) => set((state) => ({ ...state, referenceStore: dataInfo })),
}))));
exports.default = useDataStore;
//# sourceMappingURL=dataStore.js.map