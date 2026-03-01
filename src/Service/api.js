import axios from "axios";

const api = axios.create({
  // baseURL: 'https://pet-on-api.azurewebsites.net/api'
  // baseURL:
  //   "https://peton-api-prod-c8bwfnfqghgaccdn.brazilsouth-01.azurewebsites.net/api/",
  baseURL: "https://api.petmob.com.br/api/",
  // baseURL: "https://localhost:44329/api/",
});

export default api;
