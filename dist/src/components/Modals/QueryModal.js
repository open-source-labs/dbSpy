"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const queryGen_1 = __importDefault(require("../../queryGen"));
function QueryModal({ closeQueryModal }) {
    // read from schemaStore, then run queryGen 
    const { schemaStore, system } = (0, schemaStore_1.default)((state) => state);
    const queryObj = (0, queryGen_1.default)(schemaStore, system);
    // handleclose from FeatureTab to toggle this modal off
    return (react_1.default.createElement("div", { className: "modal", id: 'queryModal', style: { display: 'block', zIndex: '100' } },
        react_1.default.createElement("div", { className: 'modal-content w-[30%] min-w-[300px] max-w-[850px] content-center rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]' },
            react_1.default.createElement("p", { className: "text-slate-900 dark:text-[#f8f4eb]" }, "Queries to build your database schema: "),
            react_1.default.createElement("div", { className: 'mb-4 mt-4 bg-sky-100 rounded-lg p-2' },
                queryObj.create,
                " ",
                queryObj.alter),
            react_1.default.createElement("button", { onClick: closeQueryModal, id: 'closeQueryModal', className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]" }, "Return"))));
}
exports.default = QueryModal;
//# sourceMappingURL=QueryModal.js.map