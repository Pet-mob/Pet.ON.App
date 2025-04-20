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

export default {
    buscarAnimalUsuarioNaApi
}