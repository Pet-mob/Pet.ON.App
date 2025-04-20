import api from './api';

const buscarServicosEmpresaNaApi = async (idEmpresaPetShop) => {
    try {
        const dtoRequisicao = {
            IdEmpresa: idEmpresaPetShop
        };
        const resposta = await api.get('/Servicos/ListaServicosPetShop', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar serviços da empresa:', error);
    }
}

export default {
    buscarServicosEmpresaNaApi
}