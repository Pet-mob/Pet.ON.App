import api from './api';

const buscarAnimalUsuarioNaApi = async (idUsuario) => {
    try {
        const dtoRequisicao = {
            idUsuario: idUsuario
        };
        const resposta = await api.get('/Animal', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar animais do usuario:', error);
    };
};

const alterarAnimal = async (idUsuarioParam, nomeUsuarioParam, telefoneUsuarioParam) => {
    try {
        const dtoRequisicao = {
            idUsuario: idUsuarioParam,
            nome: nomeUsuarioParam,
            telefone: telefoneUsuarioParam

        };
        const resposta = await api.put('/Animal', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao alterar animal:', error);
        throw error;
    }
};

const inserirAnimal = async (idUsuarioParam, nomeUsuarioParam, telefoneUsuarioParam) => {
    try {
        const dtoRequisicao = {
            idUsuario: idUsuarioParam,
            nome: nomeUsuarioParam,
            telefone: telefoneUsuarioParam

        };
        const resposta = await api.post('/Animal', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao alterar animal:', error);
        throw error;
    }
};

const excluirAnimal = async (idUsuarioParam, nomeUsuarioParam, telefoneUsuarioParam) => {
    try {
        const dtoRequisicao = {
            idUsuario: idUsuarioParam,
            nome: nomeUsuarioParam,
            telefone: telefoneUsuarioParam

        };
        const resposta = await api.delete('/Animal', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao alterar animal:', error);
        throw error;
    }
};

export default {
    buscarAnimalUsuarioNaApi,
    inserirAnimal,
    alterarAnimal,
    excluirAnimal
}