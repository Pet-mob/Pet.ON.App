import api from './api';

export const buscarAnimalUsuarioNaApi = async (idUsuario) => {
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
