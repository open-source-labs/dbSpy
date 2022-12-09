import * as React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import DBDisplay from '../../src/pages/DBDisplay';
import useSchemaStore from '../../src/store/schemaStore';

interface Reference {
  PrimaryKeyName: string;
  ReferencesPropertyName: string;
  PrimaryKeyTableName: string;
  ReferencesTableName: string;
  IsDestination: boolean;
  constrainName: string;
}

interface Column {
  Name: string;
  Value: any;
  TableName: string;
  References: [Reference];
  IsPrimaryKey: boolean;
  IsForeignKey: boolean;
  field_name: string;
  data_type: string;
  additional_constraints: string;
}

interface Table {
  [key: string]: Column;
}

interface SchemaObject {
  [key: string]: Table;
}

const schema: SchemaObject = {
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
          constrainName: '',
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
    render(<DBDisplay />);
    global.ResizeObserver = jest.fn().mockImplementation(() => ({
      observe: jest.fn(),
      unobserve: jest.fn(),
      disconnect: jest.fn(),
    }));
  });

  // TODO: Add query interface
  const queryGeneration = document.querySelector('#query-generator-btn') as Element;
  const closeQuery = document.querySelector('#close-query-generator-btn') as Element;
  const copyBtn = document.querySelector('#query-generator-copy-btn') as Element;
  const dlBtn = document.querySelector('#query-generator-dl-btn') as Element;

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
    const { schemaStore, setSchemaStore } = useSchemaStore((state) => state);
    setSchemaStore(schema);
    let currStore = {};
    if (schemaStore) currStore = { ...schemaStore };
    // Open query generation
    await userEvent.click(queryGeneration);
    // Verify the strings were rendered and parsed properly into the page
    // Check each table
    Object.keys(currStore).forEach((table) => {
      expect(`CREATE TABLE "${table}"`).toBeInTheDocument;
      // Check tables columns
      Object.keys(currStore[table]).forEach((column) => {
        const {
          Name,
          Value,
          IsPrimaryKey,
          IsForeignKey,
          field_name,
          data_type,
          additional_constraints,
          References,
        } = currStore[table][column];

        let columnQuery = `${Name} ${data_type} `;
        if (IsPrimaryKey) columnQuery += ` PRIMARY KEY`;
        else columnQuery += ` ${additional_constraints}`;

        //// ALTER TABLE tbd. Refactoring on the frontend.
        if (IsForeignKey) {
          const {
            refPK: PrimaryKeyName,
            refPropName: ReferencesPropertyName,
            PrimaryKeyTableName,
            ReferencesTableName,
            IsDestination,
            constrainName,
          } = References;
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
