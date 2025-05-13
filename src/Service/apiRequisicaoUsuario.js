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

const alterarSenhaUsuario = async (senhaNovaParam, idUsuarioParam) => {
    try {
        const dtoRequisicao = {
            senhaNova: senhaNovaParam,
            idUsuario: idUsuarioParam
        };
        const resposta = await api.put('/Usuario/AlterarSenhaDoUsuario', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao alterar senha:', error);
        throw error;
    }
};

const alterarUsuario = async (idUsuarioParam, nomeUsuarioParam, telefoneUsuarioParam) => {
    try {
        const dtoRequisicao = {
            idUsuario: idUsuarioParam,
            nome: nomeUsuarioParam,
            telefone: telefoneUsuarioParam

        };
        const resposta = await api.put('/Usuario', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao alterar usuario:', error);
        throw error;
    }
};

const buscarFotoUsuario = async (idUsuarioParam) => {
    try {
        const dtoRequisicao = {
            idUsuario: idUsuarioParam
        };
        const resposta = await api.get('/Usuario/BuscarFotosUsuario', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar foto do usuario:', error);
        throw error;
    }
};

const enviarFotoUsuario = async (arquivoParam, idUsuarioParam) => {
    try {
        const dtoRequisicao = {
            arquivo: arquivoParam,
            idUsuario: idUsuarioParam
        };
        const resposta = await api.post('/Usuario/EnviarFotoDoUSuario', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao anviar foto do usuario:', error);
        throw error;
    }
};

export default {
    validarLogin,
    alterarSenhaUsuario,
    alterarUsuario,
    buscarFotoUsuario,
    enviarFotoUsuario
}