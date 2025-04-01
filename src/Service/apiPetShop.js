// apiPetshop.js
import axios from 'axios';

const BASE_URL = 'https://pet-on-api.azurewebsites.net/api';

class ApiPetshop {
    constructor() {
        this.api = axios.create({
            baseURL: BASE_URL,
        });
    }

    /**
     * Método genérico para requisições HTTP
     * @param {string} rota - Rota da API.
     * @param {string} metodo - Método HTTP ('get', 'post', 'put', 'delete').
     * @param {object} dtoRequisicao - Dados da requisição (parâmetros ou payload).
     * @returns {Promise<any>} - Retorno da requisição.
     */
    async request(rota, metodo, dtoRequisicao = {}) {
        try {
            const params = metodo.toLowerCase() === 'get' ? dtoRequisicao : {};
            const data = ['post', 'put'].includes(metodo.toLowerCase()) ? dtoRequisicao : {};
            const response = await this.api.request({
                url: rota,
                method: metodo,
                data: data,
                params: params
            });

            return response.data;
        } catch (error) {
            console.error(`Erro ao realizar requisição ${metodo.toUpperCase()} na rota ${rota}:`, error);
            throw error;
        }
    }
}

export default new ApiPetshop();