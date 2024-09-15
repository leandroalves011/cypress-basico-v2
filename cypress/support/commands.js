Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Leandro')
    cy.get('#lastName').type('Alves')
    cy.get('#email').type('leandro@teste.com')
    cy.get('#open-text-area').type('qualquer coisa como observação')
    cy.contains('button', 'Enviar').click()
})