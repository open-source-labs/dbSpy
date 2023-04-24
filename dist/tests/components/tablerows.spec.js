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
const React = __importStar(require("react"));
const react_1 = require("@testing-library/react");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
const TableNode_1 = __importDefault(require("../../src/components/ReactFlow/TableNode"));
describe('TableNodes', () => {
    // Prop to pass into single table for test
    const obj = {
        edges: [],
        table: ['Test-Name', {}]
    };
    beforeAll(() => {
        (0, react_1.render)(React.createElement(TableNode_1.default, { data: obj }));
    });
    // Confirm table rendering
    it('should render a head row', () => {
        expect(document.querySelector('.head-row')).toBeInTheDocument;
    });
    // Add row once button is fired
    it('should add a row', async () => {
        const addRowBtn = document.querySelector('.add-field');
        await user_event_1.default.click(addRowBtn);
        expect(document.querySelector('#newRow')).toBeInTheDocument;
    });
    // Currently row is added when button is pressed
    // Can go further with saving row to add more rows later
});
//# sourceMappingURL=tablerows.spec.js.map