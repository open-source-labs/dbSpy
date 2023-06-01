"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("@testing-library/react");
const react_2 = __importDefault(require("react"));
const AddReference_1 = __importDefault(require("../../src/components/DBDisplay/AddReference"));
// schemaStore mock
jest.mock('../../src/store/schemaStore', () => ({
    __esModule: true,
    default: () => ({
        schemaStore: {
            table1: {
                column1: {
                    References: [{}],
                },
            },
            table2: {
                column2: {
                    References: [{}],
                },
            },
            addForeignKeySchema: () => null,
        },
    }),
}));
// settingsStore mock
jest.mock('../../src/store/settingsStore', () => ({
    __esModule: true,
    default: () => ({
        currentTable: 'table1',
        currentColumn: 'column1',
        setEditRefMode: () => null,
    }),
}));
describe('AddReference', () => {
    beforeAll(() => {
        (0, react_1.render)(react_2.default.createElement(AddReference_1.default, null));
    });
    it('matches the snapshot', () => {
        const addRefComponent = document.querySelector('#addReference');
        expect(addRefComponent).toMatchSnapshot();
    });
});
//# sourceMappingURL=AddReference.spec.js.map