import api from './api'

export const buscarEmpresas = async () => {
    try {
        const response = await api.get(`/empresa`);
        return response.data;
    } catch (error) {
        console.error('Erro ao buscar empresa:', error);
        throw error;
    }
};