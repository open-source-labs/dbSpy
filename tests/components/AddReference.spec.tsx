import { render } from '@testing-library/react';
import React from 'react';
import AddReference from '../../src/components/DBDisplay/AddReference';

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
    render(<AddReference />);
  });

  it('matches the snapshot', () => {
    const addRefComponent = document.querySelector('#addReference');
    expect(addRefComponent).toMatchSnapshot();
  });
});
