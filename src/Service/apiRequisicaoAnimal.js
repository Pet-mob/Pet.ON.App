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

const buscarFotosAnimalPorUsuario = async (idUsuarioParam) => {
    try {
        const dtoRequisicao = {
            idUsuario: idUsuarioParam
        };
        const uri = '/Animal/BuscarFotosAnimaisPorUsuario';
        const resposta = await api.get(uri, dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar fotos animais:', error);
        throw error;
    }
};

const enviarFotosAnimalPorUsuario = async (imagem, idUsuario) => {
    const formData = new FormData();

    if (Platform.OS === 'web') {
        // `imagem` aqui é um File (do input file)
        formData.append('arquivo', imagem);
    } else {
        // `imagem` aqui é um objeto com uri, type, name
        formData.append('arquivo', {
            uri: imagem.uri,
            name: imagem.name || 'foto.jpg',
            type: imagem.type || 'image/jpeg',
        });
    }

    formData.append('idUsuario', idUsuario);
    const uri = '/Animal/EnviarFotoAnimal';

    try {
        const resposta = await api.post(uri, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return resposta.data;
    } catch (error) {
        console.error('Erro ao enviar foto do animal:', error.response?.data || error.message);
        throw error;
    }
};

export default {
    buscarAnimalUsuarioNaApi,
    inserirAnimal,
    alterarAnimal,
    excluirAnimal,
    buscarFotosAnimalPorUsuario,
    enviarFotosAnimalPorUsuario
}