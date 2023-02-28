describe('Add Table', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/display');
  });

  it('adds a table', () => {
    // open modal and submit
    cy.get('a#addTable').click();
    cy.get('button[data-testid=modal-submit]').click();
    // assert
    cy.get('div[data-testid=rf__node-untitled_table]').should('be.visible');
  });

  it('adds columns', () => {
    // open modal, add column, and submit
    cy.get('a#addTable').click();
    cy.get('button[data-testid=add-table-add-column]').click();
    cy.get('button[data-testid=modal-submit]').click();
    // assert
    cy.get('div[data-testid=rf__node-untitled_table]')
      .should('be.visible')
      .and('contain', 'column_3');
  });
});
