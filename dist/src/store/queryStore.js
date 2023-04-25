"use strict";
//
// State Management for Queries
//
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
let queryStore = (set) => ({
    queries: [],
    // setQueryStore can potentially be used for undo / redo functionality later
    setQueryStore: (queries) => set((state) => ({ ...state, queries })),
    writeAddTableQuery: (tableName) => set((state) => {
        const newQuery = `create table "public"."${tableName}" ();`;
        return {
            ...state,
            queries: [...state.queries, newQuery],
        };
    }),
});
const useQueryStore = (0, zustand_1.default)((0, middleware_1.devtools)(queryStore));
exports.default = useQueryStore;
//# sourceMappingURL=queryStore.js.map