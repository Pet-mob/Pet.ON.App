import axios from 'axios';

const api = axios.create({
    // baseURL: 'https://pet-on-api.azurewebsites.net/api'
    baseURL: 'http://192.168.0.15:5000/api'
});

export default api;
