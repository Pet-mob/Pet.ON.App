import api from './api';
import { Platform } from 'react-native';
import axios from 'axios';

const validarLogin = async (telefone, senha) => {
    try {
        const dtoRequisicao = {
            telefone,
            senha
        };

        const resposta = await api.post('/Usuario/login', dtoRequisicao);
        return resposta.data;
    } catch (error) {
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
        throw error;
    }
};

const enviarFotoUsuario = async (imagem, idUsuario) => {
    const formData = new FormData();

    if (Platform.OS === 'web') {
        // `imagem` aqui é um File (do input file)
        formData.append('arquivo', imagem);
    } else {
        // `imagem` aqui é um objeto com uri, type, name
        formData.append('arquivo', {
            uri: imagem.uri,
            name: imagem.name || 'fotoAnimal.jpg',
            type: imagem.type || 'image/jpeg',
        });
    }

    formData.append('idUsuario', idUsuario);

    try {
        const resposta = await api.post('/Usuario/EnviarFotoDoUsuario', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return resposta.data;
    } catch (error) {
        throw error;
    }
};

const inserirUsuario = async (nomeUsuarioParam, telefoneUsuarioParam, senhaParam) => {
    try {
        const dtoRequisicao = {
            nome: nomeUsuarioParam,
            telefone: telefoneUsuarioParam,
            senha: senhaParam
        };
        const resposta = await api.post('/Usuario/AdicionarUsuarioNovo', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        throw error;
    }
}

export default {
    validarLogin,
    alterarSenhaUsuario,
    alterarUsuario,
    buscarFotoUsuario,
    enviarFotoUsuario,
    inserirUsuario
}