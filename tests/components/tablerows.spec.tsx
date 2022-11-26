import * as React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import TableNode from "../../src/components/ReactFlow/TableNode";

describe('TableNodes', () => {
  // Prop to pass into single table for test
  const obj = {
    edges: [],
    table: ['Test-Name', {}]
  }

  beforeAll(() => {
    render(<TableNode data={obj} />);
  })
  
  // Confirm table rendering
  it('should render a head row', () => {
    expect(document.querySelector('.head-row')).toBeInTheDocument;
  });

  // Add row once button is fired
  it('should add a row', async () => {
    const addRowBtn = document.querySelector('.add-field') as Element;
    await userEvent.click(addRowBtn);
    expect(document.querySelector('#newRow')).toBeInTheDocument;
  })
  
  // Currently row is added when button is pressed
  // Can go further with saving row to add more rows later
});
