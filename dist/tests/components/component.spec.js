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
// Helps properly render router pages/components
const react_router_dom_1 = require("react-router-dom");
const user_event_1 = __importDefault(require("@testing-library/user-event"));
// Component imports
const Navbar_1 = __importDefault(require("../../src/components/Navbar"));
const DBDisplay_1 = __importDefault(require("../../src/pages/DBDisplay"));
describe("placeholder", () => {
    // Simple unit test tests
    it('Renders navbar', () => {
        (0, react_1.render)(React.createElement(Navbar_1.default, null), { wrapper: react_router_dom_1.BrowserRouter });
        expect(react_1.screen.getByText('Home')).toBeInTheDocument;
    });
    it('handles userEvent clicks', async () => {
        const mockFn = jest.fn();
        (0, react_1.render)(React.createElement("div", null,
            React.createElement("button", { id: "clickme", onClick: mockFn })));
        const btnTest = document.querySelector('#clickme');
        expect(mockFn).toBeCalledTimes(0);
        await user_event_1.default.click(btnTest);
        expect(mockFn).toBeCalled;
    });
});
describe('DB Display Interface', () => {
    // render DBDisplay.tsx
    let container = null;
    beforeEach(() => {
        container = document.createElement('div');
        container.setAttribute('id', 'dbDisplayCount');
        document.body.appendChild(container);
        (0, react_1.render)(React.createElement(DBDisplay_1.default, null), container);
        // render(<DBDisplay />);
        global.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });
    afterEach(() => {
        // unmountComponentAtNode(container);
        container.remove();
        container = null;
    });
    // Lefthand features toolbar
    it('should render features tab', () => {
        expect(react_1.screen.getByText('Action')).toBeInTheDocument;
    });
    // Upload database sidebar
    it('should render sidebar', () => {
        expect(react_1.screen.getByText('Full Database Link')).toBeInTheDocument;
    });
    // Main DB Display flow component
    xit('should render flow', () => {
    });
    // press buttons in featuretab - running into issues checking that userEvent.click is working
    xit('does stuff in featuretab', () => {
        const createTableModal = document.querySelector('.addTableModal');
        const styles = getComputedStyle(createTableModal);
        expect(styles.display).toBe('none');
        const anchor = document.querySelector('#addTable');
        // Click add table - shows up 'Enter your table name.""
        if (anchor)
            user_event_1.default.click(anchor);
        expect(styles.display).toBe('block');
        const closeTableButton = document.querySelector('#closeAddTable');
        user_event_1.default.click(closeTableButton);
        expect(styles.display).toBe('none');
        expect(react_1.screen.getByText('Enter your table name.')).toBeInTheDocument;
        expect(document.querySelector('#addTable')).toBeInTheDocument;
        // if (createTableModal) expect(createTableModal).toHaveStyle('display: block');
    });
    xit('Adding table confirmation should create new flow node', async () => {
        // open addTable then submit a table name
        const tableNameInput = document.querySelector('#tableNameInput');
        const anchor = document.querySelector('#addTable');
        expect(document.getElementsByClassName('flow').length).toBe(0);
        await user_event_1.default.click(anchor);
        expect(document.getElementsByClassName('flow').length).toBe(1);
        // Type into our input value
        const inputBox = document.querySelector('#tableNameInput');
        await user_event_1.default.type(tableNameInput, `first table`);
        // Click on proceed to create table
        const proceedBtn = document.querySelector('#closeAddTable-true');
        await user_event_1.default.click(proceedBtn);
        // Expect one more of that classname to exist -> class: react-flow__node-table
        // Expect that element to have the same name as the input that went in
        // expect().toBeInTheDocument;
        // expect(document.getElementsByClassName('react-flow__node-table')).toBeInTheDocument;
        expect(document.getElementsByClassName('react-flow__node-table').length).toBe(1);
    });
    // Table from above exists still so starting at length 1
    xit('Should add multiple tables when multiple tables are added', async () => {
        const anchor = document.querySelector('#addTable');
        const proceedBtn = document.querySelector('#closeAddTable-true');
        const tableNameInput = document.querySelector('#tableNameInput');
        expect(document.getElementsByClassName('react-flow__node-table').length).toBe(1);
        for (let i = 0; i < 3; i++) {
            await user_event_1.default.click(anchor);
            await user_event_1.default.type(tableNameInput, `test${i}`);
            await user_event_1.default.click(proceedBtn);
        }
        expect(document.getElementsByClassName('react-flow__node-table').length).toBe(4);
    });
    xit('Should not add duplicate named tables', async () => {
        const anchor = document.querySelector('#addTable');
        const proceedBtn = document.querySelector('#closeAddTable-true');
        const tableNameInput = document.querySelector('#tableNameInput');
        for (let i = 0; i < 3; i++) {
            await user_event_1.default.click(anchor);
            await user_event_1.default.type(tableNameInput, `test0`);
            await user_event_1.default.click(proceedBtn);
        }
        expect(document.getElementsByClassName('react-flow__node-table').length).toBe(4);
    });
    // TDD: Failing as expected.
    xit('Should not add a table when no name is provided', async () => {
        const anchor = document.querySelector('#addTable');
        const proceedBtn = document.querySelector('#closeAddTable-true');
        await user_event_1.default.click(anchor);
        await user_event_1.default.click(proceedBtn);
        expect(document.getElementsByClassName('react-flow__node-table').length).toBe(4);
    });
});
xdescribe('Table Row Generation', () => {
    beforeEach(() => {
        (0, react_1.render)(React.createElement(DBDisplay_1.default, null));
        global.ResizeObserver = jest.fn().mockImplementation(() => ({
            observe: jest.fn(),
            unobserve: jest.fn(),
            disconnect: jest.fn(),
        }));
    });
    it('Should begin empty', async () => {
        const anchor = document.querySelector('#addTable');
        const proceedBtn = document.querySelector('#closeAddTable-true');
        const tableNameInput = document.querySelector('#tableNameInput');
        await user_event_1.default.click(anchor);
        await user_event_1.default.type(tableNameInput, `test-table`);
        await user_event_1.default.click(proceedBtn);
        // expect(document.getElementsByClassName('react-flow__node-table').length).toBe(6);
        // has tr with class empty row, length of tbody children is 1
        const table = document.querySelector(`div[data-id="test-table"]`);
        const tableRows = table.querySelectorAll('tbody tr');
        // tableRows -> <tr>
        expect(tableRows).toHaveLength(1);
    });
    it('Add a single row', () => {
        expect('test').toBe('exist');
        // Expect row node length === 2
        // Have inputted id exist inside of that row
    });
    it('Add multiple rows', () => {
        expect('test').toBe('exist');
        // Expect row node length === 4 or etc
        // Have inputted id(s) exist inside of that row
    });
});
//# sourceMappingURL=component.spec.js.map