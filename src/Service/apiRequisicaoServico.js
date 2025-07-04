import api from "./api";

// Agora aceita idPorte como parâmetro e envia como query param
const buscarServicosEmpresaNaApi = async (idEmpresaPetShop, idPorte) => {
  try {
    const uri = `/Servicos/ListaServicosPetShop?IdEmpresa=${idEmpresaPetShop}&IdPorte=${idPorte}`;
    const resposta = await api.get(uri);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar serviços da empresa:", error);
  }
};

export default {
  buscarServicosEmpresaNaApi,
};
