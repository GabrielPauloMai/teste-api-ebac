const admin = require('../fixtures/administrador.json');
import {faker} from '@faker-js/faker';

/**
 * Comando para obter o token de autorização
 * @returns {void}
 */
Cypress.Commands.add('obterToken', () => {
    cy.request({
        method: 'POST',
        url: 'login',
        body: {
            email: admin.email,
            password: admin.password
        },
    }).then((response) => {
        Cypress.env('token', response.body.authorization);
    });
});

/**
 * Comando para listar os usuários
 * @returns {Response}
 */

Cypress.Commands.add('listarUsuarios', () => {
  return cy.request({
    method: 'GET',
    url: 'usuarios',
  }).then((response) => {
    return {
      status: response.status,
      body: response.body,
      quantidade: response.body.quantidade
    };
  });
});

/**
 * Comando para criar um usuário
 * @param {Usuario} usuario
 * @returns {Response}
 */

Cypress.Commands.add('criarUsuario', (usuario) => {
    return cy.request({
      method: 'POST',
      url: 'usuarios',
      headers: { authorization: Cypress.env('token') },
      body: usuario,
      failOnStatusCode: false
    })
});

/**
 * Comando para editar um usuário
 * @param {string} usuario_id
 * @param {Usuario} usuario
 * @returns {Response}
 * */

Cypress.Commands.add('editarUsuario', (usuario_id, usuario) => {
    return cy.request({
      method: 'PUT',
      url: `usuarios/${usuario_id}`,
      headers: { authorization: Cypress.env('token') },
      body: usuario,
      failOnStatusCode: false
    });
});

/**
 * Comando para deletar um usuário
 * @param {string} usuario_id
 * @returns {Response}
 */
Cypress.Commands.add('deletarUsuario', (usuario_id) => {
    return cy.request({
      method: 'DELETE',
      url: `usuarios/${usuario_id}`,
      headers: { authorization: Cypress.env('token') },
      failOnStatusCode: false
    });
});

/**
 * Comando auxiliar para criar um usuário aleatório
 * @returns {Usuario}
 * */

Cypress.Commands.add('criarUsuarioAleatorio', () => {
  let nome = faker.person.fullName();
  return cy.wrap({
    nome: nome,
    email: faker.internet.email(
      nome.split(' ')[0],
      nome.split(' ')[1],
    ),
    password: faker.internet.password(),
    administrador: faker.datatype.boolean().toString(),
  });
});


/**
 * Comando auxiliar para obter um usuário aleatório
 * @returns {Usuario}
 */
Cypress.Commands.add('obterUsuarioAleatorio', () => {
  return cy.listarUsuarios().then((response) => {
      return response.body.usuarios[Math.floor(Math.random() * response.body.quantidade)];
  });
});
