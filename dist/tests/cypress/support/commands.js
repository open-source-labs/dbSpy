"use strict";
// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
Object.defineProperty(exports, "__esModule", { value: true });
Cypress.Commands.add('addTables', (tableSchema) => {
    for (const tableName in tableSchema) {
        // open modal and input table name
        cy.get('a#addTable').click();
        cy.get('input#table-modal-name').type(`{selectAll}{backspace}${tableName}`);
        // add columns
        for (let i = 1; i <= tableSchema[tableName]; i++) {
            cy.get('button[data-testid=add-table-add-column]').click();
            // input id starts at 2 because indexes 0 and 1 are used by 'id' and 'timestamp'
            cy.get(`input#column-${i + 1}-name`).type(`{selectAll}{backspace}column_${i}`);
        }
        // submit
        cy.get('button[data-testid=modal-submit]').click();
    }
});
Cypress.Commands.add('createFk', (fkTable, fkColumn, refTable, refColumn) => {
    // open modal and fill out form
    cy.get(`div[data-testid=rf__node-${fkTable}] tr#${fkColumn} button[data-testid=edit-column]`).click();
    cy.get(`div[data-testid=rf__node-${fkTable}] tr#${fkColumn} input[type=checkbox]`).check();
    cy.get('select[name=ptablename]').select(refTable);
    cy.get('select[name=pkeyname]').select(refColumn);
    cy.get('button#save').click();
    // submit form
    cy.get('button#table_1-column2-saveBtn').click();
});
Cypress.Commands.add('dragElement', (selector, x, y, dx, dy) => {
    // drag backdrop
    cy.get(selector)
        .trigger('mousedown', x, y, {
        button: 0,
        force: true,
        eventConstructor: 'MouseEvent',
    })
        .trigger('mousemove', dx, dy, {
        button: 0,
        force: true,
        eventConstructor: 'MouseEvent',
    })
        .trigger('mouseup', dx, dy, {
        button: 0,
        force: true,
        eventConstructor: 'MouseEvent',
    });
});
//# sourceMappingURL=commands.js.map