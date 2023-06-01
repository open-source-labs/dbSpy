"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const schemaStore_1 = __importDefault(require("../../store/schemaStore"));
const queryGen_1 = __importDefault(require("../../queryGen"));
const fa_1 = require("react-icons/fa");
const copy_to_clipboard_1 = __importDefault(require("copy-to-clipboard"));
const react_2 = __importDefault(require("@tippyjs/react"));
require("tippy.js/dist/tippy.css");
function QueryModal({ closeQueryModal }) {
    // read from schemaStore, then run queryGen 
    const { schemaStore, system } = (0, schemaStore_1.default)((state) => state);
    const queryObj = (0, queryGen_1.default)(schemaStore, system);
    const [tooltipVisible, setTooltipVisible] = (0, react_1.useState)(false);
    const copyText = () => {
        const textToCopy = document.getElementById("queryModalCreateAlter").innerText;
        (0, copy_to_clipboard_1.default)(textToCopy);
        setTooltipVisible(true);
        setTimeout(() => {
            setTooltipVisible(false);
        }, 3500);
    };
    // handleclose from FeatureTab to toggle this modal off
    return (react_1.default.createElement("div", { className: "modal", id: 'queryModal', style: { display: 'block', zIndex: '100' } },
        react_1.default.createElement("div", { className: 'modal-content w-[30%] min-w-[300px] max-w-[850px] content-center rounded-md border-0 bg-[#f8f4eb] shadow-[0px_5px_10px_rgba(0,0,0,0.4)] dark:bg-slate-800 dark:shadow-[0px_5px_10px_#1e293b]' },
            react_1.default.createElement("span", { className: "flex justify-between" },
                react_1.default.createElement("p", { className: "text-slate-900 dark:text-[#f8f4eb]" }, "Queries to build your database schema: "),
                react_1.default.createElement(react_2.default, { content: 'The query has been copied to your clipboard', offset: [20, 10], trigger: "click", arrow: false, visible: tooltipVisible, delay: 250, duration: [null, 750] },
                    react_1.default.createElement("button", { onClick: copyText },
                        react_1.default.createElement(fa_1.FaCopy, { className: "hover:opacity-60" })))),
            react_1.default.createElement("div", { id: "queryModalCreateAlter", className: 'mb-4 mt-4 bg-sky-100 rounded-lg p-2' },
                queryObj.create,
                " ",
                queryObj.alter),
            react_1.default.createElement("button", { onClick: closeQueryModal, id: 'closeQueryModal', className: "modalButton text-slate-900 hover:opacity-70 dark:text-[#f8f4eb]" }, "Return"))));
}
exports.default = QueryModal;
//# sourceMappingURL=QueryModal.js.map