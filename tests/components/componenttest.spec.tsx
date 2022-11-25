import * as React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
// Helps properly render router pages/components
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

// Component imports
import Navbar from '../../src/components/Navbar';
import Signup from '../../src/pages/Signup';
import DBDisplay from '../../src/pages/DBDisplay';

describe("placeholder", () => {
  // Simple unit test tests
  it('Renders navbar', () => {
    render(<Navbar />, { wrapper: BrowserRouter });
    expect(screen.getByText('Home')).toBeInTheDocument;
  })
  it('handles userEvent clicks', async () => {
    const mockFn = jest.fn();
    render(<div>
      <button id="clickme" onClick={mockFn}></button>
    </div>)

    const btnTest = document.querySelector('#clickme') as Element;
    expect(mockFn).toBeCalledTimes(0);
    await userEvent.click(btnTest);
    expect(mockFn).toBeCalled;
  })

  it('Renders signup', () => {
    render(<Signup />);
    expect(screen.getByText('Sign Up with Google')).toBeInTheDocument;
  })
});

describe('DB Display Interface', () => {
  // render DBDisplay.tsx
  beforeEach(() => {
    render(<DBDisplay />);
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }))
  })

  // Lefthand features toolbar
  it('should render features tab', () => {
    expect(screen.getByText('Action')).toBeInTheDocument;
  })

  // Upload database sidebar
  it('should render sidebar', () => {
    expect(screen.getByText('Full Database Link')).toBeInTheDocument;
  })

  // Main DB Display flow component
  xit('should render flow', () => {

  })
  // press buttons in featuretab - running into issues checking that userEvent.click is working
  xit('does stuff in featuretab', () => {

    const createTableModal = document.querySelector('.addTableModal') as Element;
    const styles = getComputedStyle(createTableModal) as CSSStyleDeclaration;
    expect(styles.display).toBe('none');
    console.log('Create Table Modal', createTableModal);
    console.log('GetComputedStyles', styles.getPropertyValue('display'));
    // expect(createTableModal).toHaveStyle('display: none');

    const anchor = document.querySelector('#addTable');
    // Click add table - shows up 'Enter your table name.""
    if (anchor) userEvent.click(anchor);
    expect(styles.display).toBe('block');

    const closeTableButton = document.querySelector('#closeAddTable') as Element;
    // console.log(closeTableButton);
    userEvent.click(closeTableButton);
    expect(styles.display).toBe('none');


    expect(screen.getByText('Enter your table name.')).toBeInTheDocument;
    expect(document.querySelector('#addTable')).toBeInTheDocument;
    // if (createTableModal) expect(createTableModal).toHaveStyle('display: block');
  })

  it('Adding table confirmation should create new flow node', async () => {
    // open addTable then submit a table name
    const tableNameInput = document.querySelector('#tableNameInput') as Element;
    const anchor = document.querySelector('#addTable') as Element;
    expect(document.getElementsByClassName('flow').length).toBe(0);
    await userEvent.click(anchor);
    expect(document.getElementsByClassName('flow').length).toBe(1);
    
    const inputBox = document.querySelector('#tableNameInput') as Element
    // Type into our input value
    // userEvent.type(inputBox, 'Hello World');
    // Check that input value
    // expect(inputBox.current.value)
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
  it('Should add multiple tables when multiple tables are added', async () => {
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
  it('Should not add duplicate named tables', async () => {
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
  it('Should not add a table when no name is provided', async () => {
    const anchor = document.querySelector('#addTable') as Element;
    const proceedBtn = document.querySelector('#closeAddTable-true') as Element;
    await userEvent.click(anchor);
    await userEvent.click(proceedBtn);
    expect(document.getElementsByClassName('react-flow__node-table').length).toBe(4);
  })
});