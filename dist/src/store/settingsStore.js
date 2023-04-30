"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// //
// // State Management for settings (button toggles, view toggles, etc.)
// //
// export default useSettingsStore;
const zustand_1 = __importDefault(require("zustand"));
const middleware_1 = require("zustand/middleware");
let settingsStore = (set) => ({
    darkMode: true,
    setDarkMode: () => set((state) => ({ ...state, darkMode: !state.darkMode })),
    sidebarDisplayState: false,
    welcome: true,
    setWelcome: (input) => set((state) => ({ ...state, welcome: input })),
    currentTable: '',
    currentColumn: '',
    editRefMode: false,
    setEditRefMode: (isEditRefMode, table = '', col = '') => set((state) => ({
        ...state,
        editRefMode: isEditRefMode,
        currentTable: table,
        currentColumn: col,
    })),
    inputModalState: { isOpen: false, mode: '' },
    setInputModalState: (isOpen, mode = '', currentTable = '') => {
        set((state) => ({
            ...state,
            currentTable,
            inputModalState: { isOpen, mode },
        }));
    },
    isSchema: true,
    setTableMode: (input) => set((state) => ({ ...state, isSchema: !state.isSchema })),
    //!state.isSchema or input??  ##########
});
// settingsStore = devtools(settingsStore);
const useSettingsStore = (0, zustand_1.default)((0, middleware_1.devtools)(settingsStore));
exports.default = useSettingsStore;
//# sourceMappingURL=settingsStore.js.map