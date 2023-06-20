import {pegarTodosContatos,pegarContatoPorId,atualizarContato,criarContato,deletarContato} from './servico.js'

async function postContato (req, res) {
    try {
        const contatoNovo = req.body;
        const resposta = await criarContato(contatoNovo);
        return res.status(201).json(resposta);
    } catch (error) {
        return res.status(error.status).json(error.body);
    }
}

async function getContatos(req, res) {
        const todosContatos = await pegarTodosContatos();
        return res.status(200).json(todosContatos);
}

async function putContato(req, res){
    try {
       const contatoAtualizado = req.body;
       const id = req.params.id;
       const resposta = await atualizarContato(contatoAtualizado, id);
       return res.status(200).json(resposta);
    } catch (error) {
        return res.status(error.status).json(error.body);
    }
}

async function getContato(req, res) {
        const id = req.params.id;
        const contato = await pegarContatoPorId(id);
        if (contato.length === 0){
            return res.status(204).json(contato);
        }
        return res.status(200).json(contato);
}

async function deleteContato(req,res){
    try {
        const id = req.params.id;
        const contato = await deletarContato(id);
        return res.status(202).json(contato);
    } catch (error) {
        return res.status(error.status).json(error.body);
    }
}

export {
    postContato,
    getContatos,
    putContato,
    getContato,
    deleteContato
}