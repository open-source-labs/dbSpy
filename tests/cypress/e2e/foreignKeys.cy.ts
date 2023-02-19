describe('Foreign Keys', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/display');
    cy.addTables({ table_1: 1, table_2: 2 });
  });

  it('adds a foreign key', () => {
    // edit table_1:column_1 to be a foreign key that references table_2:column_2
    cy.createFk('table_1', 'column_1', 'table_2', 'column_2');
    // assert fk arrow is displayed
    cy.get('g[data-testid=rf__edge-table_1-to-table_2]')
      .should('be.visible')
      .within(($g) => {
        cy.get('path').should('have.length', 2);
        cy.get('g.react-flow__edge-textwrapper').should(
          'contain',
          'column_1-to-column_1'
        );
      });
  });

  it('adds a foreign key if user drags table, drags backdrop, and changes zoom', () => {
    //click 'edit column' button
    cy.get(
      `div[data-testid=rf__node-table_1] tr#column_1 button[data-testid=edit-column]`
    ).click();
    // zoom out 3x
    cy.get('button.react-flow__controls-zoomout').click();
    cy.get('button.react-flow__controls-zoomout').click();
    cy.get('button.react-flow__controls-zoomout').click();
    // drag table
    cy.dragElement('[data-testid=rf__node-table_1', 10, 200, 0, -100);
    // drag backdrop
    cy.dragElement('.react-flow__pane', 10, 10, 100, 300);
    // check fk checkbox
    cy.get(`div[data-testid=rf__node-table_1] tr#column_1 input[type=checkbox]`).check();
    // fill out modal form
    cy.get('select[name=ptablename]').select('table_2');
    // fill out modal form
    cy.get('select[name=pkeyname]').select('column_2');
    // submit modal form
    cy.get('button#save').click();
    // drag backdrop
    cy.dragElement('.react-flow__pane', 10, 10, 100, 300);
    // drag table
    cy.dragElement('[data-testid=rf__node-table_1', 10, 200, 50, -200);
    // zoom in
    cy.get('button.react-flow__controls-zoomin').click();
    // save column
    cy.get('button#table_1-column2-saveBtn').click();
    // drag table
    cy.dragElement('[data-testid=rf__node-table_1', 10, 200, 0, -100);
    // assert fk arrow is displayed
    cy.get('g[data-testid=rf__edge-table_1-to-table_2]')
      .should('be.visible')
      .within(($g) => {
        cy.get('path').should('have.length', 2);
        cy.get('g.react-flow__edge-textwrapper').should(
          'contain',
          'column_1-to-column_1'
        );
      });
  });
});
