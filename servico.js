import { readFileSync, writeFileSync } from 'fs'
const contatosJson = './fileDB/contatos.json'
const listaContatos = JSON.parse(readFileSync(contatosJson));

function mensagemErro(status, mensagem, title) {
  var errorMessage = {
    status: status,
    body: {
      message: mensagem,
      title: title
    }
  }
  return errorMessage;
}

function criar_UUID(){
  let dt = new Date().getTime();
  const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = (dt + Math.random()*16)%16 | 0;
      dt = Math.floor(dt/16);
      return (c=='x' ? r :(r&0x3|0x8)).toString(16);
  });
  return uuid;
}


function validaNome(nome) {
  const contemNumeros = /[0-9]/;
  if (contemNumeros.test(nome) || typeof nome === "boolean") {
    throw (mensagemErro(400, "O Nome inserido deve ter apenas letras", "Erro ao cadastrar novo contato"));
  }
  if (nome === undefined || nome === null || nome.length < 3) {
    throw (mensagemErro(400, "O campo Nome deve ter ao menos 3 caracteres.", "Erro ao cadastrar novo contato"));
  }
}

function validaTelefone(telefone) {
  if (!(telefone.length >= 10 && telefone.length <= 11)) return false;
  if (telefone.length === 11 && parseInt(telefone.substring(2, 3)) != 9) return false;
  return true;
}

function validaEmail(email) {
  const re = /\S+@\S+\.\S+/;
  if (!re.test(email)) {
    throw (mensagemErro(400, "O Email não é Inválido.", "Erro ao cadastrar novo contato"));
  }
  return re.test(email);

}

 function criarContato(contatoNovo) {
  const id = criar_UUID();
  const nome = contatoNovo.nome;
  const telefone = contatoNovo.telefone;
  const email = contatoNovo.email;
  const contatoExistente = listaContatos.contatos.find(contato => contato.nome === nome || contato.telefone === telefone || contato.email === email);
  if (contatoExistente === null || contatoExistente === undefined) {
    validaNome(nome);
    if (telefone === undefined || telefone === null || typeof telefone === "boolean" || !validaTelefone(telefone)) {
      throw (mensagemErro(400, "O Telefone é Inválido.", "Erro ao cadastrar novo contato"));
    }
    validaEmail(email);
    const contatoNovoOrdenado = { id: id, nome: nome, telefone: telefone, email: email };
    listaContatos.contatos.push(contatoNovoOrdenado);
    writeFileSync(contatosJson, JSON.stringify(listaContatos));
    return contatoNovoOrdenado;
  }
  throw (mensagemErro(400, "Nome,Telefone ou Email já cadastrado! Verifique as informações.", "Dados de Contato já Cadastrados"));
}

 function pegarContatoPorId(id) {
  const contatoConsultado = listaContatos.contatos.filter(contato => contato.id === id)
  if (contatoConsultado.length === 0) {
    return contatoConsultado;
  }
  const contatoFiltrado = { contatos: contatoConsultado };
  return contatoFiltrado;
}

 function atualizarContato(contatoAtualizado, id) {
  const nome = contatoAtualizado.nome;
  const telefone = contatoAtualizado.telefone;
  const email = contatoAtualizado.email;
  const contatoConsultado = listaContatos.contatos.filter(contato => contato.id === id)
  if (contatoConsultado.length === 0) {
    throw (mensagemErro(404, "Contato não existente", "Erro ao atualizar novo contato"))
  }
  const contatoExistente = listaContatos.contatos.find(contato => contato.nome === nome || contato.telefone === telefone || contato.email === email);
  if (contatoExistente === null || contatoExistente === undefined) {
    const itemModificado = listaContatos.contatos.findIndex(contato => contato.id === id);
    if (itemModificado === null || itemModificado === undefined) {
      throw (mensagemErro(404, "O contato não existe", "Erro ao Atualizar o Contato"));
    }
    validaNome(nome);
    if (telefone === undefined || telefone === null || typeof telefone === "boolean" || !validaTelefone(telefone)) {
      throw (mensagemErro(400, "O Telefone é Inválido.", "Erro ao cadastrar novo contato"));
    }
    validaEmail(email);
    const conteudoAtualizado = { ...listaContatos.contatos[itemModificado], ...contatoAtualizado };
    listaContatos.contatos[itemModificado] = conteudoAtualizado;
    writeFileSync(contatosJson, JSON.stringify(listaContatos));
    return listaContatos.contatos[itemModificado]
  }
  throw (mensagemErro(400, "Nome,Telefone ou Email já existentes! Verifique as informações.", "Dados de Contato já Cadastrados"));
}

 function pegarTodosContatos() {
  return listaContatos;
}

 function deletarContato(id) {
  const contatoConsultado = listaContatos.contatos.filter(contato => contato.id === id)
  if (contatoConsultado.length === 0) {
    throw (mensagemErro(404, "Contato não existente", "Erro ao deletar novo contato"));
  }
  const contatosAtualizados = {contatos: listaContatos.contatos.filter(contato => contato.id !== id)};
  writeFileSync(contatosJson, JSON.stringify(contatosAtualizados));
}

export {
  mensagemErro,
  validaNome,
  validaTelefone,
  validaEmail,
  pegarTodosContatos,
  pegarContatoPorId,
  atualizarContato,
  criarContato,
  deletarContato
}