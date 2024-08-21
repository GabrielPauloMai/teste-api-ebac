/// <reference types="cypress" />
import UsuariosPage from "../support/page-objects/usuarios.page";
import UsuariosContract from "../contracts/usuarios.contract";

describe('Testes da Funcionalidade Usuários', () => {

  before(() => {
    UsuariosPage.obterToken();
  });

  it('Deve validar contrato de usuários', () => {
    UsuariosPage.listarUsuarios().then((response) => {
      UsuariosContract.validateAsync(response.body);
    });
  });

  it('Deve listar usuários cadastrados', () => {
    UsuariosPage.listarUsuarios().then((response) => {
      expect(response.status).to.eq(200)
      expect(response.body.usuarios).to.be.an('array')
      expect(response.body.usuarios.length).to.eq(response.body.quantidade)
    });
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    UsuariosPage.criarUsuario(UsuariosPage.criarUsuarioAleatorio()).then((response) => {
      expect(response.status).to.eq(201)
      expect(response.body.message).to.eq('Cadastro realizado com sucesso')
    });
  });

  it('Deve validar um usuário com email inválido', () => {
    UsuariosPage.obterUsuarioAleatorio().then((usuario) => {
      const usuarioInvalido = UsuariosPage.criarUsuarioAleatorio();
      usuarioInvalido.email = usuario.email;

        UsuariosPage.criarUsuario(usuarioInvalido).then((response) => {
            expect(response.status).to.eq(400)
            expect(response.body.message).to.eq('Este email já está sendo usado')
        });

    });
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    UsuariosPage.obterUsuarioAleatorio().then((usuario) => {
      UsuariosPage.editarUsuario(usuario._id, UsuariosPage.criarUsuarioAleatorio()).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Registro alterado com sucesso')
      });
    });

  });

  it('Deve deletar um usuário previamente cadastrado', () => {
    UsuariosPage.obterUsuarioAleatorio().then((usuario) => {
      UsuariosPage.deletarUsuario(usuario._id).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.message).to.eq('Registro excluído com sucesso')
      });
    });
  });


});
