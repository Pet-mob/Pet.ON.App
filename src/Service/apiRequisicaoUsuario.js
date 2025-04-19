import api from './api';

const validarLogin = async (telefone, senha) => {
    try {
        const dtoRequisicao = {
            telefone,
            senha
        };

        const resposta = await api.post('/Usuario/login', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar usuario:', error);
        throw error;
    }
};

export default {
    validarLogin
}