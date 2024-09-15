/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it.only('preenche os campos obrigatórios e envia o formulário', function() {
        cy.get('#firstName').type('Leandro')
        cy.get('#lastName').type('Alves')
        cy.get('#email').type('leandro@teste.com')
        cy.get('#open-text-area').type('qualquer coisa como observação')
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })

    it('preenche os campos obrigatórios e envia formulário, com um delay rápido para campos longos', function(){
        const textoLongo = 'Esse texto é muito, muito, muito longo que serve para testar a propriedade delay do .type'
        cy.get('#firstName').type('Jose')
        cy.get('#lastName').type('Filho')
        cy.get('#email').type('jose@teste.com')
        cy.get('#open-text-area').type(textoLongo)
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')
    })
  })
  