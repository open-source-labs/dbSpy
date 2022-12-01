import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';

import DBDisplay from "../../src/pages/DBDisplay";

describe('QueryGenerator...', () => {
  // render DBDisplay before each test
  
  describe('Table Architecture', () => {
    let tableNameInput: any;
    let anchor: any;
    let proceedBtn: any;
    beforeEach(() => {
      render(<DBDisplay />);
      global.ResizeObserver = jest.fn().mockImplementation(() => ({
        observe: jest.fn(),
        unobserve: jest.fn(),
        disconnect: jest.fn(),
      }))
      tableNameInput = document.querySelector('#tableNameInput') as Element;
      anchor = document.querySelector('#addTable') as Element;
      proceedBtn = document.querySelector('#closeAddTable-true') as Element;
    });

    it('should add a create table query', async () => {
      // process for adding a table
      await userEvent.click(anchor);
      await userEvent.type(tableNameInput, `test0`);
      await userEvent.click(proceedBtn);
      expect(screen.getByText('create table "public"."test0" ();')).toBeInTheDocument;
    });
    it('should add multiple create table queries', async () => {
      for (let i = 0; i < 3; i++){
        await userEvent.click(anchor);
        await userEvent.type(tableNameInput, `multi-test${i}`);
        await userEvent.click(proceedBtn);
        expect(screen.getByText(`create table "public"."multi-test${i}" ();`)).toBeInTheDocument;
      }
    });
    // it should add a new element containing "alter table [blah blah blah]" when altering tables
    it('should add single/multiple create row query', () => {
      // ALTER TABLE table_name ADD column_name datatype;
      const table = document.querySelector(`div[data-id="test0"]`) as Element;
      
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
    })

    //// Stretch feature tests ////
    xit('Undo/redo accurately reflected in query generator', () => {

    });
    xit('Time traveling snapshots accurately reflected in query generator', () => {

    })
  });
})