//* .spec (the expected behavior for the component) vs .test (straughtforward saying here are the tests)

import React from 'react';
// render- lets us display the component
// screen- allows us to query the DOM for els
// waitFor- waits for async UI updates (ex- Axios completes)
import { render, screen, waitFor } from '@testing-library/react';
// simulates user behavior
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import TestNewQuery from '../../src/pages/TestNewQuery';
import axios, { Axios } from 'axios';
import { AxiosResponse } from 'axios';

// Wrap component in BrowserRouter to render Register inside router (helper function)
const renderWithRouter = (component: React.ReactElement): ReturnType<typeof render> => {
  return render(<BrowserRouter>{component}</BrowserRouter>);
};

//? TESTS
describe('Test New Query Component', () => {
  //? Testing (1): Test New Query heading renders
  it('renders the Test New Query heading', () => {
    renderWithRouter(<TestNewQuery />);
    // will check if the heading 'Test Your Query!' is rendering on the screen
    expect(screen.getByRole('heading', { name: /Test New Query/i })).toBeInTheDocument();
  });

  //? Testing (2): input fields render
  it('renders the input fields (Query Name, DB Link, Query)', () => {
    renderWithRouter(<TestNewQuery />);
    // will check input fields are rendering on the screen
    expect(screen.getByPlaceholderText(/Name your query/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Enter DB link here/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Write your SQL query here/i)).toBeInTheDocument();
  });

  //? Testing (3): buttons render
  it('render the buttons (Test Query, Save Query, Improve with AI)', () => {
    renderWithRouter(<TestNewQuery />);
    // will check buttons are rendering on the screen
    const testQueryButton = screen.getByRole('button', { name: /Run Query/i });
    const saveQueryButton = screen.getByRole('button', { name: /Save Query/i });
    const improveWithAIButton = screen.getByRole('button', { name: /Improve with AI/i });
    expect(testQueryButton).toBeInTheDocument();
    expect(saveQueryButton).toBeInTheDocument();
    expect(improveWithAIButton).toBeInTheDocument();
  });

  //? Testing (4): input fields are editable
  it('checks input fields are editable', async (): Promise<void> => {
    renderWithRouter(<TestNewQuery />);
    // will find input fields by placeholder text
    const queryNameInput: HTMLTextAreaElement =
      screen.getByPlaceholderText(/Name your query/i);
    const dbLinkInput: HTMLTextAreaElement =
      screen.getByPlaceholderText(/Enter DB link here/i);
    const queryInput: HTMLTextAreaElement = screen.getByPlaceholderText(
      /Write your SQL query here/i
    );

    // will simulate typing into the input field
    await userEvent.type(queryNameInput, 'My Test Query');
    await userEvent.type(dbLinkInput, 'My Test DB Link');
    await userEvent.type(queryInput, 'My Test SQL Query');

    // will check if the input field has the expected value
    expect(queryNameInput).toHaveValue('My Test Query');
    expect(dbLinkInput).toHaveValue('My Test DB Link');
    expect(queryInput).toHaveValue('My Test SQL Query');
  });

  //? Testing (5): clicking Run Query button triggers Get Req
  it('checks if clicking Run Query button triggers req to the BE', async () => {
    // mocking the axios Get Req
    const mockGet = jest.spyOn(axios, 'get').mockResolvedValue({
      data: ['Query: SELECT * FROM users', 'Date: 2025-04-11'],
    });
    renderWithRouter(<TestNewQuery />);
    // will simulate user typing into input fields
    const queryNameInput: HTMLTextAreaElement =
      screen.getByPlaceholderText(/Name your query/i);
    const dbLinkInput: HTMLTextAreaElement =
      screen.getByPlaceholderText(/Enter DB link here/i);
    const queryInput: HTMLTextAreaElement = screen.getByPlaceholderText(
      /Write your SQL query here/i
    );

    await userEvent.type(queryNameInput, 'My Test Query');
    await userEvent.type(dbLinkInput, 'postgres://user:pass@host:5432/db');
    await userEvent.type(queryInput, 'SELECT * FROM users');

    // Run Query button
    const runQueryButton = screen.getByRole('button', { name: /Run Query/i });

    // will simulate user clicking the Run Query button
    await userEvent.click(runQueryButton);
    // wait / confirm for the mocked axios Get Req to be called
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledTimes(1);
    });
    // remove mock before next test
    mockGet.mockRestore();
  });

  //? Testing (6): clicking Save Query button triggers Post Req
  it('checks if clicking Save Query button triggers req to the BE', async () => {
    // mocking running a query so we have queryResult
    const getMockResponse: AxiosResponse<{ metrics: string[]; otherMetrics: any[] }> = {
      data: {
        metrics: [
          'Query Name: Testing Sunday',
          'Query: SELECT * FROM people',
          'Date Run: 2025-04-11',
          'Execution Time: 0.042',
        ],
        otherMetrics: [
          {
            planningTime: 1.932,
            actualTotalTime: 0.025,
            totalCost: 2.87,
            nodeType: 'Seq Scan',
            relationName: 'people',
            planRows: 87,
            actualRows: 87,
            sharedHit: 2,
            sharedRead: 0,
          },
        ],
      },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };

    const postMockResponse: AxiosResponse<any> = {
      data: 'Query saved successfully!',
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    // mocking the axios Get Req w/ a mocked response
    const mockGet = jest.spyOn(axios, 'get').mockResolvedValue(getMockResponse);
    const mockPost = jest.spyOn(axios, 'post').mockResolvedValue(postMockResponse);

    renderWithRouter(<TestNewQuery />);

    // will simulate user typing into input fields
    const queryNameInput: HTMLTextAreaElement =
      screen.getByPlaceholderText(/Name your query/i);
    const dbLinkInput: HTMLTextAreaElement =
      screen.getByPlaceholderText(/Enter DB link here/i);
    const queryInput: HTMLTextAreaElement = screen.getByPlaceholderText(
      /Write your SQL query here/i
    );
    // will simulate user's inputed query data
    await userEvent.type(queryNameInput, 'My Test Query');
    await userEvent.type(dbLinkInput, 'postgres://user:pass@host:5432/db');
    await userEvent.type(queryInput, 'SELECT * FROM users');

    // will simulate user clicking the Run Query button
    const runQueryButton = screen.getByRole('button', { name: /Run Query/i });
    await userEvent.click(runQueryButton);

    // will wait for mocked axios Get Req to be called
    await waitFor(() => {
      expect(mockGet).toHaveBeenCalledTimes(1);
    });

    // will simulate user clicking the Save Query button
    const saveQueryButton = screen.getByRole('button', { name: /Save Query/i });
    await userEvent.click(saveQueryButton);

    // will wait for mocked axios Post Req to be called
    await waitFor(() => {
      expect(mockPost).toHaveBeenCalledTimes(1);
    });
    // remove mocks before next test
    mockPost.mockRestore();
    mockGet.mockRestore();
  });

  //? Testing (7): clicking Run Query button renders a table w/ results
  it('checks if clicking Run Query button renders a table with results', async (): Promise<void> => {
    // mocking the axios Get Req w/ a mocked response
    // using TS to define the response
    const mockData = {
      metrics: [
        'Query Name: My Test Query',
        'Query: SELECT * FROM users',
        'Date Run: 2025-04-11',
        'Execution Time: 0.042',
      ],
      otherMetrics: [
        {
          planningTime: 1.932,
          actualTotalTime: 0.025,
          totalCost: 2.87,
          nodeType: 'Seq Scan',
          relationName: 'people',
          planRows: 87,
          actualRows: 87,
          sharedHit: 2,
          sharedRead: 0,
        },
      ],
    };
    // using TS to define the response
    const mockResponse: AxiosResponse<{ metrics: string[]; otherMetrics: any[] }> = {
      data: mockData,
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {},
    };
    // mocking the axios Get Req w/ a mocked response
    const mockGet = jest.spyOn(axios, 'get').mockResolvedValue(mockResponse);

    renderWithRouter(<TestNewQuery />);

    // input fields
    const queryNameInput: HTMLTextAreaElement =
      screen.getByPlaceholderText(/Name your query/i);
    const dbLinkInput: HTMLTextAreaElement =
      screen.getByPlaceholderText(/Enter DB link here/i);
    const queryInput: HTMLTextAreaElement = screen.getByPlaceholderText(
      /Write your SQL query here/i
    );

    // will simulate user typing into input fields
    await userEvent.type(queryNameInput, 'My Test Query');
    await userEvent.type(dbLinkInput, 'postgres://user:pass@host:5432/db');
    await userEvent.type(queryInput, 'SELECT * FROM users');

    // simulate user clicking Run Query button
    const runQueryButton: HTMLButtonElement = screen.getByRole('button', {
      name: /Run Query/i,
    });

    await userEvent.click(runQueryButton);
    screen.debug();

    // will wait for QUery Results heading to render
    await waitFor(() => {
      expect(screen.getByText(/Query Results/i)).toBeInTheDocument();
    });

    // will check that all parts of our mocked results render
    expect(screen.getByText(/My Test Query/i)).toBeInTheDocument();
    expect(screen.getByText(/SELECT \* FROM users/i)).toBeInTheDocument();
    expect(screen.getByText(/2025-04-11/i)).toBeInTheDocument();
    expect(screen.getByText(/0.042/i)).toBeInTheDocument();

    // remove mock before next test
    mockGet.mockRestore();
  });

  //? Testing (8): clicking Run Query button renders error message
  // mock the axios Get Req to fail
  // confirm error message renders (error running query, check db link and query)

  //? Testing (9): clicking Run Query button clears the input fields
  // mock running a query
  // confirm input fields are cleared

  //? Testing (9): clicking Save Query button renders 'Query Saved!'
  // mock saving a query
  // confirm 'Query Saved!' renders
  // currently THIS is failing. Even if the req to save the query fails, the 'Query Saved!' message still renders
});
