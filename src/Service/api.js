import axios from 'axios';

const api = axios.create({
    baseURL: 'https://pet-on-api.azurewebsites.net/api'
});

export default api;
