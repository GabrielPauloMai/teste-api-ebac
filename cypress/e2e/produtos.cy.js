/// reference types="cypress" />;
import ProdutosPage from "../support/page-objects/produtos.page";
import produtosContratos from "../contracts/produtos.contract";

describe('Teste de API - Produtos', () => {
  before(() => {
    ProdutosPage.obterToken();
  })

  it('Deve validar o contrato de produtos com sucesso', () => {
    ProdutosPage.listarProdutos().then((response) => {
      produtosContratos.validateAsync(response.body)
    })
  });

  it('Deve listar produtos com sucesso - GET', () => {
    ProdutosPage.listarProdutos().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.produtos).to.be.an('array')
      expect(response.body.produtos.length).to.eq(response.body.quantidade)
    })
  })

  it('Deve cadastrar um produto com sucesso - POST', () => {
    ProdutosPage.criarProduto(ProdutosPage.gerarProduto()).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.message).to.equal('Cadastro realizado com sucesso')
    })
  })


  it('Deve validar mensagem de produto já cadastrado - POST', () => {

    ProdutosPage.listarProdutos().then((response) => {
      let produtoregistrado = response.body.produtos[0]
      const produto = {
        nome: produtoregistrado.nome,
        preco: produtoregistrado.preco,
        descricao: produtoregistrado.descricao,
        quantidade: produtoregistrado.quantidade
      }
      cy.log(produto)
      ProdutosPage.criarProduto(produto).then((response) => {
      expect(response.status).to.eq(400)
      expect(response.body.message).to.equal('Já existe produto com esse nome')
    })

    })



  })

  it('Deve editar um produto com sucesso - PUT', () => {

    ProdutosPage.obterProdutoAleatorio().then((produto_id) => {
      ProdutosPage.editarProduto(produto_id, ProdutosPage.gerarProduto()).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.equal('Registro alterado com sucesso')
      })
    })

  })

  it('Deve deletar um produto com sucesso - DELETE', () => {

    ProdutosPage.obterProdutoAleatorio().then((produto_id) => {
        ProdutosPage.deletarProduto(produto_id).then((response) => {
            expect(response.status).to.eq(200)
            expect(response.body.message).to.equal('Registro excluído com sucesso')
        })
    })
  })

})