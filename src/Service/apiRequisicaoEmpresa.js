import api from "./api";

const buscarEmpresas = async (idCategoria) => {
  try {
    const uri = `/Empresa`;
    if (idCategoria > 0) uri = uri + `?IdCategoria=${idCategoria}`;
    const resposta = await api.get(uri);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    throw error;
  }
};

const buscarEmpresasVinculadoAoUsuario = async (idUsuario, idCategoria) => {
  try {
    const uri = `/Empresa/BuscarEmpresasVinculadoAoUsuario?idUsuario=${idUsuario}&idCategoria=${idCategoria}`;
    const resposta = await api.get(uri);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    throw error;
  }
};

const buscarNaAPIPorNomePetShop = async (campoBuscarPorNomePetShop) => {
  try {
    if (campoBuscarPorNomePetShop == "") return null;
    const dtoRequisicao = {
      DescricaoNomeFantasia: campoBuscarPorNomePetShop,
    };
    const resposta = await api.get("/Empresa", dtoRequisicao);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar empresa:", error);
    throw error;
  }
};

const buscarLogosEmpresas = async () => {
  try {
    const resposta = await api.get("/Empresa/BuscarLogosEmpresas");
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar logos da empresa:", error);
    throw error;
  }
};

const enviarLogoEmpresa = async (arquivoParam, idEmpresaParam) => {
  try {
    const dtoRequisicao = {
      arquivo: arquivoParam,
      idEmpresa: idEmpresaParam,
    };
    const resposta = await api.post(
      "/Empresa/EnviarLogoEmpresa",
      dtoRequisicao
    );
    return resposta.data;
  } catch (error) {
    console.error("Erro ao enviar logo da empresa:", error);
    throw error;
  }
};

export default {
  buscarEmpresas,
  buscarNaAPIPorNomePetShop,
  buscarEmpresasVinculadoAoUsuario,
  buscarLogosEmpresas,
  enviarLogoEmpresa,
};
