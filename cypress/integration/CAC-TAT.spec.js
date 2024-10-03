/// <reference types="Cypress" />

describe('Central de Atendimento ao Cliente TAT', function() {
    const THREE_SECONDS_IN_MS = 3000

    beforeEach(function() {
        cy.visit('./src/index.html')
    })

    it('verifica o título da aplicação', function() {
        cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('preenche os campos obrigatórios e envia o formulário', function() {
        cy.get('#firstName').type('Leandro')
        cy.get('#lastName').type('Alves')
        cy.get('#email').type('leandro@teste.com')
        cy.get('#open-text-area').type('qualquer coisa como observação')
        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible') //.sucess = busca por uma class = sucess no CSS/HTML da página
    })

    it('preenche os campos obrigatórios e envia formulário, com um delay rápido para campos longos', function(){
        const textoLongo = 'Esse texto é muito, muito, muito longo que serve para testar a propriedade delay do .type'

        cy.clock() //congela o relógio do navegador

        cy.get('#firstName').type('Jose')
        cy.get('#lastName').type('Filho')
        cy.get('#email').type('jose@teste.com')
        cy.get('#open-text-area').type(textoLongo, {delay: 0 })
        cy.contains('button', 'Enviar').click()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS) //avança 3 segundos no tempo, com a variável criada no describe

        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.clock()

        cy.get('#firstName').type('Jose')
        cy.get('#lastName').type('Filho')
        cy.get('#email').type('jose@teste,com')
        cy.get('#open-text-area').type('somente teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible') //quanto tem um ponto após cy.get, ele busca por uma classe com aquele nome

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })
        
    it('campo telefone continua vazio quando preenchido com valor não-numérico', function(){
        cy.get('#phone')
            .type('abcdefghij')
            .should('have.value', '')
   
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.clock()

        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Silva')
        cy.get('#email').type('joão@teste.com')
        cy.get('#phone-checkbox').click() //ao clicar/selecionar o campo telefone, ele torna-se obrigatório
        //nessa linha deveria ter digitado o numero de telefone se fosse um teste com 'caminho feliz'
        cy.get('#open-text-area').type('somente teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')
    })

    it('preenche e limpa os campos nome, sobrenome, email e telefone', function(){

        cy.get('#firstName') //pega o id do primeiro nome
            .type('Leandro') //digita o valor
            .should('have.value', 'Leandro') //verifica o valor digitado
            .clear() //limpa o campo do id firstName
            .should('have.value', '') //verifica novamente, porém uma validação sem valor onde o campo deve estar em branco

        cy.get('#lastName')
            .type('Alves')
            .should('have.value', 'Alves')
            .clear()
            .should('have.value', '')

        cy.get('#email')
            .type('leandro@exemplo.com')
            .should('have.value', 'leandro@exemplo.com')
            .clear()
            .should('have.value', '')

        cy.get('#phone')
            .type('12345566777')
            .should('have.value', '12345566777')
            .clear()
            .should('have.value', '')
    })

    it('exibe mensagem de erro ao submeter o formulário sem preencher os campos obrigatórios', function(){
        cy.clock()

        cy.contains('button', 'Enviar').click() //busca um elemento BUTTON no CSS, e que tenha o texto ENVIAR (em casos de elementos ruins, buscar pelo texto do elemento, que geralmente é único, é uma boa opção)

        cy.get('.error').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.error').should('not.be.visible')

    })

    it('envia o formulário com sucesso usando um comando customizado', function(){
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(THREE_SECONDS_IN_MS)

        cy.get('.success').should('not.be.visible')
    })

    it('seleciona um produto (Youtube) por seu texto', function(){
        cy.get('#product') //pega elemento do tipo product
            .select('YouTube') //não precisa colocar cy.get em comandos que já estejam identados/concatenados. Por exemplo, acima dessa linha já tem um get para pegar o elemento #product
            .should('have.value', 'youtube') //com Y minusculo, pq está verificando o valor, e não o texto
    })

    it('seleciona um produto (Mentoria) por seu valor (value)', function(){
        cy.get('#product')
            .select('mentoria')
            .should('have.value', 'mentoria')
    })

    it('seleciona um produto (Blog) por seu índice)', function(){
        cy.get('#product')
            .select(1) //selecionando o produto por índice, no caso o produto na posição 1 [0,1,2 e 3] 
            .should('have.value', 'blog')
    })

    it('marca o tipo de atendimento "Feedback"', function(){
        cy.get('input[type="radio"][value="feedback"]') //identifica elemento type=radio, com valor=feedback (encontrado inspecionando o elemento)
            .check()
            .should('have.value', 'feedback')
    })

    it('marca cada tipo de atendimento', function(){
        cy.get('input[type="radio"]')
            .should('have.length', 3)
            .each(function($radio) { //rever aula 5 para tirar dúvidas
                cy.wrap($radio).check()
                cy.wrap($radio).should('be.checked')
            })
    })

    //estudar mais sobre .each

    it('marca ambos checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]')
            .check() //comando somente para marcar checkboxes ou radios (nesse caso, marcou todos devido serem o mesmo seletor type=checkbox)
            .should('be.checked')
            .last() //seleciona o último elemento do mesmo tipo obtido no get (conforme esse caso de teste)
            .uncheck() //comando somente para desmarcar checkboxes ou radios
            .should('not.be.checked')
    })

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário utilizando check', function(){
        cy.get('#firstName').type('João')
        cy.get('#lastName').type('Silva')
        cy.get('#email').type('joão@teste.com')
        cy.get('#phone-checkbox').check()
        //nessa linha deveria ter digitado o numero de telefone se fosse um teste com 'caminho feliz'
        cy.get('#open-text-area').type('somente teste')
        cy.contains('button', 'Enviar').click()

        cy.get('.error').should('be.visible')
    })

    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]') //como só tem um input do tipo file, pode ser esse comando. Do contrário, usar ID
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]') //como só tem um input do tipo file, pode ser esse comando. Do contrário, usar ID
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'})
        .should(function($input) {
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile')
        cy.get('input[type="file"]')
            .selectFile('@sampleFile')
            .should(function($input) {
                expect($input[0].files[0].name).to.equal('example.json')
            })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a') //dentro da DIV privacy seleciona o atributo A (ID = privacy, atribute = A)
            .should('have.attr', 'target', '_blank')
    })

    //Atributo target com valor _blank, refere-se que o link será aberto em outra aba do navegador

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target') //comando cy.invoke está invocando o metodo remove attribute, que realiza ação no atributo target, logo ao clicar no link não irá abrir em outra página
            .click()
        cy.contains('Talking About Testing')
            .should('be.visible')
    })

    /*
    it('teste para falhar e gerar a pasta screenshot', function(){
        cy.title().should('be.equal', 'Central de NNNNN ao Cliente TAT')
    })
})   
    */
it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function() {
    cy.get('.success')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Mensagem enviada com sucesso.')
      .invoke('hide')
      .should('not.be.visible')
    cy.get('.error')
      .should('not.be.visible')
      .invoke('show')
      .should('be.visible')
      .and('contain', 'Valide os campos obrigatórios!')
      .invoke('hide')
      .should('not.be.visible')
    })

it('preenche a area de texto usando o comando invoke', function(){
    const newLongText = Cypress._.repeat('0123456789', 20)
    
    cy.get('#open-text-area')
        .invoke('val', newLongText) //invoca um valor, de uma variável
        .should('have.value', newLongText)
    })

it('faz uma requisição HTTP', function() {
    cy.request('https://cac-tat.s3.eu-central-1.amazonaws.com/index.html') //cy.request utilizado para testes de API
        .should(function(response) { //a função recebe a resposta(response) da requisição/request
            const {status, statusText, body} = response //campos contidos no inspect da URL acima
            expect(status).to.equal(200)
            expect(statusText).to.equal('OK')
            expect(body).to.include('CAC TAT')
        })
    })

it('encontra o gato escondido', function(){
    cy.get('#cat') //pega o ID = cat
        .invoke('show')
        .should('be.visible')
    cy.get('#title')
        .invoke('text', 'CAT TAT') //busca o ID = title, altera a propriedade text para CAT TAT
    cy.get('#subtitle')
        .invoke('text', 'I 💚 cats')        
    })
})
