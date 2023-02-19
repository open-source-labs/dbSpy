describe('routes', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080');
  });

  it('displays home page', () => {
    cy.contains('Database development');
    cy.contains('simplified.');
  });
  it('navigates to Display page', () => {
    cy.get('a[data-testid=navbar-display]').click();
    cy.url().should('include', 'display');
    cy.contains('Welcome to dbSpy!');
  });
});

describe('Display', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080/display');
  });

  describe('Connect Database', () => {
    it('connects to Postgres database', () => {
      // open up the form, input the url, and submit
      cy.get('a[data-testid=connect-database]').click();
      cy.get('input[name=database_link]').type(Cypress.env('PG_TEST_URL'));
      cy.get('form button').click();
      // assert
      cy.get('div[data-testid="rf__node-public.films"]')
        // cy.get('div[data-testid=rf__node-public.pilots]')
        .should('be.visible')
        .and('contain', 'public.pilots');
    });
  });
});
