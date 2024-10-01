Cypress._.times(3, function(){

    it('testa a página da política de privacidade de forma independente', function(){
        cy.visit('./src/privacy.html')
        cy.contains('Talking About Testing')
        .should('be.visible')
    })
})

// Cypress._.times() = funcionalidade que repete o teste. Executa uma função de callback X vezes.
// lodash (lib do javascript)