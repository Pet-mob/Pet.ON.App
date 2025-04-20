import api from './api'

const buscarEmpresas = async () => {
    try {
        const resposta = await api.get('/Empresa');
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        throw error;
    }
};

const buscarNaAPIPorNomePetShop = async (campoBuscarPorNomePetShop) => {
    try {
        if (campoBuscarPorNomePetShop == "") return null;
        const dtoRequisicao = {
            DescricaoNomeFantasia: campoBuscarPorNomePetShop
        };
        const resposta = await api.get('/Empresa', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        throw error;
    }
};

export default {
    buscarEmpresas,
    buscarNaAPIPorNomePetShop
}