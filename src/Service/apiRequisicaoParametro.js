import api from "./api";

const buscarParametro = async (idEmpresa) => {
  try {
    const resposta = await api.get(`Parametros?idEmpresa=${idEmpresa}`);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar parametro:", error);
  }
};

export default {
  buscarParametro,
};
