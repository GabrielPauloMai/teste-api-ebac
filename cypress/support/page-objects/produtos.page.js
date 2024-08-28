import { faker } from "@faker-js/faker";
const admin = require('../../fixtures/administrador.json');

class ProdutosPage {

    constructor() {
        this.token = null;
    }

    /**
     * @typedef {Object} Produto
     * @property {string} nome
     * @property {float} preco
     * @property {string} descricao
     * @property {number} quantidade
     */

    /**
     * Obtém o token de autorização e armazena na variável `token`
     * @returns {void}
     */
    obterToken() {
        cy.request({
            method: 'POST',
            url: 'login',
            body: {
                email: admin.email,
                password: admin.password
            },
        }).then((response) => {
            this.token = response.body.authorization;
        })
    }


    /**
     * Faz a requisição para criar um produto
     * @param {Produto} produto
     * @returns {Response}
     */
    criarProduto(produto) {
        return cy.request({
            method: 'POST',
            url: 'produtos',
            headers: {
                authorization: this.token
            },
            body: produto, failOnStatusCode: false
        }).then((response) => {
            cy.log(response)
            return cy.wrap({
                status: response.status,
                body: response.body,
                message: response.body.message

            })
        })
    }

    /**
     * Faz a requisição para listar produtos
     * @returns {Promise}
     */
    listarProdutos() {
        return cy.request({
            method: 'GET',
            url: 'produtos',
        }).then((responseData) => {
            return cy.wrap({
                status: responseData.status,
                body: responseData.body
            })
        })
    }

    /**
     * Cria um produto com dados aleatórios
     * @returns {Produto}
     */
    gerarProduto() {
        return {
            nome: faker.commerce.productName(),
            preco: faker.commerce.price(),
            descricao: faker.commerce.productDescription(),
            quantidade: faker.datatype.number(
                {
                    'min': 1,
                    'max': 100
                }
            )
        }
    }

    /**
     * Edita um produto
     * @param {string} produto_id
     * @param {Produto} produto
     * @returns {Promise} 
     */
    editarProduto(produto_id, produto) {
        return cy.request({
            method: 'PUT',
            url: `produtos/${produto_id}`,
            headers: {
                authorization: this.token
            },
            body: produto
        }).then((responseData) => {
            return cy.wrap({
                status: responseData.status,
                body: responseData.body
            })
        })
    }


    /**
     * Deleta um produto
     * @param {string} produto_id
     * @returns {Promise} 
     */
    deletarProduto(produto_id) {
        return cy.request({
            method: 'DELETE',
            url: `produtos/${produto_id}`,
            headers: {
                authorization: this.token
            }, failOnStatusCode: false
        }).then((responseData) => {
            return cy.wrap({
                status: responseData.status,
                body: responseData.body
            })
        })
    }

    /**
     *Retorna o _id de um produto aleatório
     * @returns {string}
     * */
    obterProdutoAleatorio() {
        this.gerarProduto().then((produto) => {
            this.criarProduto(produto).then((response) => {
                expect(response.status).to.eq(201)
            })
        })

        return this.listarProdutos().then((response) => {
            return response.body.produtos[
                Math.floor(Math.random() * (response.body.quantidade - 0 + 1))
                ]._id
        })
    }
}
export default new ProdutosPage()