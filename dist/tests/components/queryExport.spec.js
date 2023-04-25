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
const schemaStore_1 = __importDefault(require("../../src/store/schemaStore"));
const schema = {
    testTable: {
        testColumn: {
            Name: 'testColumn',
            Value: 10,
            TableName: 'testTable',
            References: [
                {
                    PrimaryKeyName: '',
                    ReferencesPropertyName: '',
                    PrimaryKeyTableName: '',
                    ReferencesTableName: '',
                    IsDestination: false,
                    constraintName: '',
                },
            ],
            IsPrimaryKey: false,
            IsForeignKey: false,
            field_name: 'uhhh',
            data_type: 'BigInt',
            additional_constraints: '',
        },
    },
};
// TODO: Isolate to rendering just the query generator instead of DBDisplay
describe('Query Exports', () => {
    beforeAll(() => {
        (0, react_1.render)(React.createElement(DBDisplay_1.default, null));
        global.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });
    // TODO: Add query interface
    const queryGeneration = document.querySelector('#query-generator-btn');
    const closeQuery = document.querySelector('#close-query-generator-btn');
    const copyBtn = document.querySelector('#query-generator-copy-btn');
    const dlBtn = document.querySelector('#query-generator-dl-btn');
    xit('Renders query generation button', () => {
        expect(queryGeneration).toBeInTheDocument;
    });
    // TODO: Add a close query generator button
    xit('Renders a close query button', () => {
        expect(closeQuery).toBeInTheDocument;
    });
    // TODO: Add a copy button the frontend
    xit('Functional copy to clipboard button', () => {
        expect(copyBtn).toBeInTheDocument;
    });
    // TODO: Add a download button the frontend
    xit('Functional download query button', () => {
        expect(dlBtn).toBeInTheDocument;
    });
    xit('Export parses db model accurately', async () => {
        const { schemaStore, setSchemaStore } = (0, schemaStore_1.default)((state) => state);
        setSchemaStore(schema);
        let currStore = {};
        if (schemaStore)
            currStore = { ...schemaStore };
        // Open query generation
        await user_event_1.default.click(queryGeneration);
        // Verify the strings were rendered and parsed properly into the page
        // Check each table
        Object.keys(currStore).forEach((table) => {
            expect(`CREATE TABLE "${table}"`).toBeInTheDocument;
            // Check tables columns
            Object.keys(currStore[table]).forEach((column) => {
                const { Name, Value, IsPrimaryKey, IsForeignKey, field_name, data_type, additional_constraints, References, } = currStore[table][column];
                let columnQuery = `${Name} ${data_type} `;
                if (IsPrimaryKey)
                    columnQuery += ` PRIMARY KEY`;
                else
                    columnQuery += ` ${additional_constraints}`;
                //// ALTER TABLE tbd. Refactoring on the frontend.
                if (IsForeignKey) {
                    const { refPK: PrimaryKeyName, refPropName: ReferencesPropertyName, PrimaryKeyTableName, ReferencesTableName, IsDestination, constraintName, } = References;
                    expect(columnQuery).toBeInTheDocument;
                }
            });
        });
        // {
        //   name,
        //   data,
        //   primary key or not,
        //   misc. requirements,
        //   reference: {
        //     name,
        //     data,
        //     primary key or not,
        //     misc. requirements,
        //   }
        // }
    });
});
//# sourceMappingURL=queryExport.spec.js.map