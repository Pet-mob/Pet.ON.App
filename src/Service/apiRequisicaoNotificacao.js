import api from './api';

const buscarNotificacao = async (idUsuario) => {
    try {
        const resposta = await api.get(`/Notificacao/ListarNotificacoes/${idUsuario}`);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar notificacao:', error);
    }
}

export default {
    buscarNotificacao
}