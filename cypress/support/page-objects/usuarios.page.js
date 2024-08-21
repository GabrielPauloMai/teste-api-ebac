const admin = require('../../fixtures/administrador.json');
import { faker, InternetModule } from '@faker-js/faker';

class UsuariosPage {

    constructor() {
        this.token = null;
    }

    /**
     * @typedef {Object} Usuario
     * @property {string} nome
     * @property {string} email
     * @property {string} password
     * @property {string} administrador
     * @property {string} [_id]
     */

    /**
     *Obtém o token de autorização e armazena na variável `token`
     * @returns {void}
     * */
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
     * Lista todos os usuários
     * @returns {Response}
     */
    listarUsuarios() {
        return cy.request({
            method: 'GET',
            url: 'usuarios',
        }).then((response) => {
            return cy.wrap({
                status: response.status,
                body: response.body,
                quantidade: response.body.quantidade
            });
        });
    };

    /**
     * Faz a requisição para criar um usuário
     * @param {Usuario} usuario
     * @returns {Response}
     */
    criarUsuario(usuario) {
        return cy.request({
            method: 'POST',
            url: 'usuarios',
            headers: { authorization: this.token },
            body: usuario, failOnStatusCode: false
        });
    }

    /**
     * Edita um usuário
     * @param {string} usuario_id
     * @param {Usuario} usuario
     * @returns {Response}
     */
    editarUsuario(usuario_id, usuario) {
        return cy.request({
            method: 'PUT',
            url: `usuarios/${usuario_id}`,
            headers: { authorization: this.token },
            body: usuario, failOnStatusCode: false
        });
    }

    /**
     *Deleta um usuário
     * @param {string} usuario_id
     * @returns {Response}
     */
    deletarUsuario(usuario_id) {
        return cy.request({
            method: 'DELETE',
            url: `usuarios/${usuario_id}`,
            headers : { authorization: this.token },
            failOnStatusCode: false
        });
    }


    /**
     * Cria um usuário com dados aleatórios
     * @returns {Usuario}
     */
    criarUsuarioAleatorio(isAdmin = false) {

        let nome = faker.person.fullName();
        return {
            nome: nome,
            email: faker.internet.email(
                nome.split(' ')[0],
                nome.split(' ')[1],
            ),
            password: faker.internet.password(),
            administrador: isAdmin ? 'true' : faker.datatype.boolean().toString(),
        }
    };

    /**
     * Obtém um usuário aleatório
     * @returns {Usuario}
     */
    obterUsuarioAleatorio() {
        return this.listarUsuarios().then((response) => {
            let usuario = response.body.usuarios[Math.floor(Math.random() * response.body.quantidade)];
            return usuario;
        });
    }
}
export default new UsuariosPage();