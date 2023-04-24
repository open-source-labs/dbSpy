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
const DBDisplay_1 = __importDefault(require("../../src/pages/DBDisplay"));
xdescribe('QueryGenerator...', () => {
    // render DBDisplay before each test
    describe('Table Architecture', () => {
        let tableNameInput;
        let anchor;
        let proceedBtn;
        beforeEach(() => {
            (0, react_1.render)(React.createElement(DBDisplay_1.default, null));
            global.ResizeObserver = jest.fn().mockImplementation(() => ({
                observe: jest.fn(),
                unobserve: jest.fn(),
                disconnect: jest.fn(),
            }));
            tableNameInput = document.querySelector('#tableNameInput');
            anchor = document.querySelector('#addTable');
            proceedBtn = document.querySelector('#closeAddTable-true');
        });
        xit('should add a create table query', async () => {
            // process for adding a table
            await user_event_1.default.click(anchor);
            await user_event_1.default.type(tableNameInput, `test0`);
            await user_event_1.default.click(proceedBtn);
            expect(react_1.screen.getByText('create table "public"."test0" ();')).toBeInTheDocument;
        });
        xit('should add multiple create table queries', async () => {
            for (let i = 0; i < 3; i++) {
                await user_event_1.default.click(anchor);
                await user_event_1.default.type(tableNameInput, `multi-test${i}`);
                await user_event_1.default.click(proceedBtn);
                expect(react_1.screen.getByText(`create table "public"."multi-test${i}" ();`)).toBeInTheDocument;
            }
        });
        // it should add a new element containing "alter table [blah blah blah]" when altering tables
        it('should add single/multiple create row query', () => {
            // ALTER TABLE table_name ADD column_name datatype;
            const table = document.querySelector(`div[data-id="test0"]`);
            // Expect row query to be in the generator
            // Expect query generator length to be incremented
        });
        // "..." containing "delete"
        xit('should add a edit row query', () => {
            // User clicks on tableName edit button
            // Adds new value in text box
            // Hits save
            // ALTER TABLE table_name ALTER COLUMN column_name datatype;
            // Expect new row name to be in table
            // Expect old name to not be in table
            // Expect new line in query generator
            // Should not do those things if the new row name already exists
        });
        // ... other actions
        xit('should add single/multiple delete row query', () => {
            // ALTER TABLE table_name DROP COLUMN column_name;
            // Expect rows length to be minus num of deletions
        });
        // Doesnt exist at all
        xit('should add a delete table query', () => {
            // DROP TABLE [IF EXISTS] table_name;
        });
        //// Stretch feature tests ////
        xit('Undo/redo accurately reflected in query generator', () => {
        });
        xit('Time traveling snapshots accurately reflected in query generator', () => {
        });
    });
});
//# sourceMappingURL=queryGenerator.spec.js.map