import { describe, expect, it, jest } from "@jest/globals"
import { criarContato, atualizarContato, validaNome, validaEmail, validaTelefone, mensagemErro } from '../servico.js'
import app from '../app.js'
import request from 'supertest'

let server;
beforeEach(() => {
  const port = 3001;
  server = app.listen(port);
});

afterEach(() => {
  server.close();
});

describe('Testes da api de contatos do lab_henrique', () => {

  it('Deve retornar lista de contatos', async () => {
    const retornado = await request(app)
      .get('/contato').set('Accept', 'application/json')
      .expect('content-type', /json/).expect(200);
    expect(retornado.body).toBeDefined;
  });

  let idResposta;
  it('Deve ser criado um novo contato ', async () => {
    const retornado = await request(app)
      .post('/contato')
      .send({
        nome: 'Bom dia e Companhia',
        telefone: '1140028922',
        email: 's@s.com',
      })
      .expect(201);

    idResposta = retornado.body.id;

    expect(retornado).toBeDefined();
  });

  it('Deve nao adicionar nada ao passar o body vazio', async () => {
    await request(app)
      .post('/contato')
      .send({})
      .expect(400);
  });
  it('Deve retornar contato especifico', async () => {
    await request(app)
      .get(`/contato/${idResposta}`)
      .expect(200);
  });
  it('Deve retornar vazio ao não passar o id ou id inválido', async () => {
    await request(app)
      .get(`/contato/:id`)
      .expect(204);
  });

  it('Deve ser atualizado o contato', async () => {
    const requisicao = { request };
    const spy = jest.spyOn(requisicao, 'request');
    await requisicao.request(app)
      .put(`/contato/${idResposta}`)
      .send({
        nome: 'contato teste',
        telefone: '1734614495',
        email: 'contato@teste.com',
      })
      .expect(200);

    expect(spy).toHaveBeenCalled();
  });
  it('Deve nao atualizar ao passar o body vazio', async () => {
    await request(app)
      .put(`/contato/${idResposta}`)
      .send({})
      .expect(400);
  });

  it('Deve nao atualizar ao passar id inválido', async () => {
    await request(app)
      .put(`/contato/:id`)
      .send({
        nome: 'contato teste',
        telefone: '1734614495',
        email: 'contato@teste.com',
      })
      .expect(404);
  });

  it('Deve ter contato deletado', async () => {
    await request(app)
      .delete(`/contato/${idResposta}`)
      .expect(202);
  });

  it('Deve não deletar ao não passar o id ou id inválido', async () => {
    await request(app)
      .delete(`/contato/:id`)
      .expect(404);
  });

  it('Deve retornar um erro', () => {
    let retornado = mensagemErro(500, "E dessa vez foram nosos servidores. Estamos trabalhando para resolver esse problema. Por favor, tente novamente mais tarde.", "Todo mundo erra!");
    expect(retornado).toBeDefined();
  });

  it('Deve retornar erro de Nome que não tem somente letras', () => {
    expect(() => { validaNome('Ad23') }).toThrow();
  })

  it('Deve retornar erro de Nome que tem menos que 3 caracteres', () => {
    expect(() => { validaNome('Ad') }).toThrowError();
  })
  it('Deve retornar erro de Email inválido', () => {
    expect(() => { validaEmail('correio.2.com') }).toThrow();
  })

  it('Deve não cadastrar e retornar erro de contato já cadastrado', () => {
      expect(() => { criarContato({nome: "Julio Cesar",
      telefone: "1129135715",
      email: "sergiy4721@uorak.com"}) }).toThrow();
  })

  it('Deve não atualizar e retornar erro de contato já cadastrado', () => {
      expect(() => {atualizarContato({nome: "Julio Cesar",
      telefone: "1129135715",
      email: "sergiy4721@uorak.com"}, "0c2e814d-00bc-4aae-966f-15ed7507a8fe")}).toThrow();
  })
});
