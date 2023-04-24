"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
describe('Connect Database', () => {
    beforeEach(() => {
        cy.visit('http://localhost:8080/display');
    });
    it('connects to Postgres database', () => {
        // open up the form, input the url, and submit
        cy.get('a[data-testid=connect-database]').click();
        cy.get('input[name=database_link]').type(Cypress.env('PG_TEST_URL'));
        cy.get('form button').click();
        // assert
        cy.get('div[data-testid="rf__node-public.films"]')
            .should('be.visible')
            .and('contain', 'public.films');
    });
});
//# sourceMappingURL=connectDatabase.cy.js.map