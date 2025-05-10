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

const alterarAnimal = async (idAnimalParam, nomeParam, idadeParam, racaParam, observacoesParam, idUsuarioParam) => {
    try {
        const dtoRequisicao = {
            idAnimal: idAnimalParam,
            nome: nomeParam,
            idade: idadeParam,
            raca: racaParam,
            observacoes: observacoesParam,
            idUsuario: idUsuarioParam
        };
        const resposta = await api.put('/Animal', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao alterar animal:', error);
        throw error;
    }
};

const inserirAnimal = async (nomeParam, idadeParam, racaParam, observacoesParam, idUsuarioParam) => {
    try {
        const dtoRequisicao = {
            nome: nomeParam,
            idade: idadeParam,
            raca: racaParam,
            observacoes: observacoesParam,
            idUsuario: idUsuarioParam
        };
        const resposta = await api.post('/Animal', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao adicionar animal:', error);
        throw error;
    }
};

const excluirAnimal = async (idUsuarioParam, idAnimalParam) => {
    try {
        const uri = `/Animal?IdUsuario=${idUsuarioParam}&IdAnimal=${idAnimalParam}`;
        const resposta = await api.delete(uri);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao excluir animal:', error);
        throw error;
    }
};

export default {
    buscarAnimalUsuarioNaApi,
    inserirAnimal,
    alterarAnimal,
    excluirAnimal
}