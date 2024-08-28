/// <reference types="cypress" />
import UsuariosContract from "../contracts/usuarios.contract";

describe('Testes da Funcionalidade Usuários', () => {

  before(() => {
    cy.obterToken();
  });

  it('Deve validar contrato de usuários', () => {
    cy.listarUsuarios().then((response) => {
      UsuariosContract.validateAsync(response.body);
    });
  });

  it('Deve listar usuários cadastrados', () => {
    cy.listarUsuarios().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.usuarios).to.be.an('array')
      expect(response.body.usuarios.length).to.eq(response.body.quantidade)
    });
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.criarUsuarioAleatorio().then((usuario) => {
        cy.criarUsuario(usuario).then((response) => {
            expect(response.status).to.eq(201)
            expect(response.body.message).to.eq('Cadastro realizado com sucesso')
        });
    });

  });

  it('Deve validar um usuário com email inválido', () => {
    cy.criarUsuarioAleatorio().then((usuario) => {
        usuario.email = 'emailinvalido';
        cy.criarUsuario(usuario).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.email).to.eq('email deve ser um email válido')
        });
    });
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    cy.obterUsuarioAleatorio().then((usuario) => {
      cy.criarUsuarioAleatorio().then((novoUsuario) => {
        cy.editarUsuario(usuario._id, novoUsuario).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.message).to.eq('Registro alterado com sucesso')
        });
      });
    });

  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    cy.criarUsuarioAleatorio().then((usuario) => {
      cy.criarUsuario(usuario).then((response) => {
        cy.deletarUsuario(response.body._id).then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.message).to.eq('Registro excluído com sucesso')
        });
      });
  });
  });


});
