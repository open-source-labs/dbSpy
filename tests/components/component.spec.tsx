import * as React from "react";
import { render, screen } from "@testing-library/react";
import fetch from 'node-fetch';
// Helps properly render router pages/components
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Component imports
import Navbar from '../../src/components/Navbar';
import Signup from '../../src/pages/Signup';
import DBDisplay from '../../src/pages/DBDisplay';

(global.fetch as jest.Mock) = jest.fn(() => 
  Promise.resolve({
    json: () => Promise.resolve({}),
  })
);

let mockState = {
  sidebarDisplayState: false,
  welcome: true,
  editRefMode: false,
  inputModalState: { isOpen: false, mode: '' },
  inputDataModalState: { isOpen: false, mode: '' },
  deleteTableModalState: { isOpen: false },
  currentTable: '',
  isSchema: true,
}

describe('DBDisplay Interface', () => {
  // render DBDisplay.tsx
  let container: any = null;
  beforeEach(() => {
    container = document.createElement('div');
    container.setAttribute('id', 'dbDisplayCount');
    document.body.appendChild(container);
    render(<DBDisplay />, container);
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  afterEach(() => {
    container.remove();
    container = null;
  })

  it('should render Navbar', () => {
      render(<Navbar />, { wrapper: BrowserRouter });
      expect(screen.getByText('Home')).toBeInTheDocument;
    })

  // Renders FeatureTab on left of screen
  it('should render features tab', () => {
    expect(screen.getByText('Action')).toBeInTheDocument;
  })

  // Renders Sidebar on right of screen
  it('should render sidebar when sidebarDisplay state is true', () => {
    mockState.sidebarDisplayState = true;
    // Should test its rendering sidebarDisplay
    // expect(screen.getByText('Full Database Link')).toBeInTheDocument;
  })

  // Main DB Display flow component test
  xit('should render flow', () => {
    
  })
  // press buttons in featuretab - running into issues checking that userEvent.click is working
  it('should respond correctly when buttons are clicked', () => {
    //
    const createTableModal = document.querySelector('.addTableModal') as Element;
    const styles = getComputedStyle(createTableModal) as CSSStyleDeclaration;
    expect(styles.display).toBe('none');
    
    //Add Table button on initial render does not display table modal
    const anchor = document.querySelector('#addTable');
    // Click add table - shows up 'Enter your table name.""
    if (anchor) userEvent.click(anchor);
    expect(styles.display).toBe('block');

    const closeTableButton = document.querySelector('#closeAddTable') as Element;
    userEvent.click(closeTableButton);
    expect(styles.display).toBe('none');


    expect(screen.getByText('Enter your table name.')).toBeInTheDocument;
    expect(document.querySelector('#addTable')).toBeInTheDocument;
    if (createTableModal) expect(createTableModal).toHaveStyle('display: block');
  })

  xit('Adding table confirmation should create new flow node', async () => {
    // open addTable then submit a table name
    const tableNameInput = document.querySelector('#tableNameInput') as Element;
    const anchor = document.querySelector('#addTable') as Element;
    expect(document.getElementsByClassName('flow').length).toBe(0);
    await userEvent.click(anchor);
    expect(document.getElementsByClassName('flow').length).toBe(1);
    
    // Type into our input value
    const inputBox = document.querySelector('#tableNameInput') as Element
    await userEvent.type(tableNameInput, `first table`)
    // Click on proceed to create table
    const proceedBtn = document.querySelector('#closeAddTable-true') as Element;
    await userEvent.click(proceedBtn);
    
    // Expect one more of that classname to exist -> class: react-flow__node-table
    // Expect that element to have the same name as the input that went in
    // expect().toBeInTheDocument;
    // expect(document.getElementsByClassName('react-flow__node-table')).toBeInTheDocument;
    expect(document.getElementsByClassName('react-flow__node-table').length).toBe(1);
    
  })
  // Table from above exists still so starting at length 1
  xit('Should add multiple tables when multiple tables are added', async () => {
    const anchor = document.querySelector('#addTable') as Element;
    const proceedBtn = document.querySelector('#closeAddTable-true') as Element;
    const tableNameInput = document.querySelector('#tableNameInput') as Element;
    expect(document.getElementsByClassName('react-flow__node-table').length).toBe(1);
    for (let i = 0; i < 3; i++) {
      await userEvent.click(anchor);
      await userEvent.type(tableNameInput, `test${i}`)
      await userEvent.click(proceedBtn);
    }
    expect(document.getElementsByClassName('react-flow__node-table').length).toBe(4);
  })
  xit('Should not add duplicate named tables', async () => {
    const anchor = document.querySelector('#addTable') as Element;
    const proceedBtn = document.querySelector('#closeAddTable-true') as Element;
    const tableNameInput = document.querySelector('#tableNameInput') as Element;
    for (let i = 0; i < 3; i++) {
      await userEvent.click(anchor);
      await userEvent.type(tableNameInput, `test0`)
      await userEvent.click(proceedBtn);
    }
    expect(document.getElementsByClassName('react-flow__node-table').length).toBe(4);
  })
  // TDD: Failing as expected.
  xit('Should not add a table when no name is provided', async () => {
    const anchor = document.querySelector('#addTable') as Element;
    const proceedBtn = document.querySelector('#closeAddTable-true') as Element;
    await userEvent.click(anchor);
    await userEvent.click(proceedBtn);
    expect(document.getElementsByClassName('react-flow__node-table').length).toBe(4);
  })
});

xdescribe('Table Row Generation', () => {
  beforeEach(() => {
    render(<DBDisplay />);
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))
  })
  
  
  it('Should begin empty', async () => {
    const anchor = document.querySelector('#addTable') as Element;
    const proceedBtn = document.querySelector('#closeAddTable-true') as Element;
    const tableNameInput = document.querySelector('#tableNameInput') as Element;
    await userEvent.click(anchor);
    await userEvent.type(tableNameInput, `test-table`);
    await userEvent.click(proceedBtn);
    
    // expect(document.getElementsByClassName('react-flow__node-table').length).toBe(6);
    // has tr with class empty row, length of tbody children is 1
    const table = document.querySelector(`div[data-id="test-table"]`) as Element;
    const tableRows = table.querySelectorAll('tbody tr');
    
    // tableRows -> <tr>
    expect(tableRows).toHaveLength(1);
  })
  it('Add a single row', () => {
    expect('test').toBe('exist');
    // Expect row node length === 2
    // Have inputted id exist inside of that row
  }) 
  it('Add multiple rows', () => {
    expect('test').toBe('exist');
    // Expect row node length === 4 or etc
    // Have inputted id(s) exist inside of that row
  })
});