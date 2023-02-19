// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands';

type ColumnCount = number;
type TableSchema = {
  [TableName: string]: ColumnCount;
};

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add multiple tables.
       * @example cy.addTables({table_1: 5, table_2: 0})
       */
      addTables(tableSchema: TableSchema): Chainable<JQuery<HTMLElement>>;
      /**
       * Custom command to create a foreign key relationship.
       * @example cy.createFk('table_1', 'column_1', 'table_2', 'column_2')
       */
      createFk(
        fkTable: string,
        fkColumn: string,
        refTable: string,
        refColumn: string
      ): Chainable<JQuery<HTMLElement>>;
      /**
       * Custom command to drag an element.
       * @example cy.dragElement('.react-flow__pane', 10, 10, 300, 300)
       */
      dragElement(
        selector: string,
        x: number,
        y: number,
        dx: number,
        dy: number
      ): Chainable<JQuery<HTMLElement>>;
    }
  }
}
