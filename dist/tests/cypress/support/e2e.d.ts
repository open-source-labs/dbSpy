/// <reference types="cypress" />
/// <reference types="cypress" />
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
            createFk(fkTable: string, fkColumn: string, refTable: string, refColumn: string): Chainable<JQuery<HTMLElement>>;
            /**
             * Custom command to drag an element.
             * @example cy.dragElement('.react-flow__pane', 10, 10, 300, 300)
             */
            dragElement(selector: string, x: number, y: number, dx: number, dy: number): Chainable<JQuery<HTMLElement>>;
        }
    }
}
export {};
//# sourceMappingURL=e2e.d.ts.map