import api from "./api";
import { Platform } from "react-native";

const buscarAnimalUsuarioNaApi = async (idUsuario) => {
  try {
    const uri = `/Animal?IdUsuario=${idUsuario}`;
    const resposta = await api.get(uri);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar animais do usuario:", error);
  }
};

const alterarAnimal = async (
  idAnimalParam,
  nomeParam,
  idadeParam,
  racaParam,
  observacoesParam,
  idUsuarioParam,
  idPorteParam
) => {
  try {
    const dtoRequisicao = {
      idAnimal: idAnimalParam,
      nome: nomeParam,
      idade: idadeParam,
      raca: racaParam,
      observacoes: observacoesParam,
      idUsuario: idUsuarioParam,
      idPorte: idPorteParam,
    };
    const resposta = await api.put("/Animal", dtoRequisicao);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao alterar animal:", error);
    throw error;
  }
};

const inserirAnimal = async (
  nomeParam,
  idadeParam,
  racaParam,
  observacoesParam,
  idUsuarioParam,
  idPorteParam
) => {
  try {
    const dtoRequisicao = {
      nome: nomeParam,
      idade: idadeParam,
      raca: racaParam,
      observacoes: observacoesParam,
      idUsuario: idUsuarioParam,
      idPorte: idPorteParam,
    };
    const resposta = await api.post("/Animal", dtoRequisicao);
    return resposta.data;
  } catch (error) {
    throw error;
  }
};

const excluirAnimal = async (idUsuarioParam, idAnimalParam) => {
  try {
    const uri = `/Animal?IdUsuario=${idUsuarioParam}&IdAnimal=${idAnimalParam}`;
    const resposta = await api.delete(uri);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao excluir animal:", error);
    throw error;
  }
};

const buscarFotosAnimalPorUsuario = async (idUsuarioParam) => {
  try {
    const dtoRequisicao = {
      idUsuario: idUsuarioParam,
    };
    const uri = "/Animal/BuscarFotosAnimaisPorUsuario";
    const resposta = await api.get(uri, dtoRequisicao);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar fotos animais:", error);
    throw error;
  }
};

const enviarFotosAnimalPorUsuario = async (imagem, idUsuario, idAnimal) => {
  const formData = new FormData();

  if (Platform.OS === "web") {
    // `imagem` aqui é um File (do input file)
    formData.append("arquivo", imagem);
  } else {
    // `imagem` aqui é um objeto com uri, type, name
    formData.append("arquivo", {
      uri: imagem.uri,
      name: imagem.name || "foto.jpg",
      type: imagem.type || "image/jpeg",
    });
  }

  formData.append("idUsuario", idUsuario);
  formData.append("idAnimal", idAnimal);

  try {
    const resposta = await api.post("/Animal/EnviarFotoAnimal", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return resposta.data;
  } catch (error) {
    throw error;
  }
};

const adicionarAnimalNovo = async (nomeParam, racaParam, idUsuarioParam) => {
  try {
    const dtoRequisicao = {
      nome: nomeParam,
      raca: racaParam,
      idUsuario: idUsuarioParam,
    };
    const resposta = await api.post(
      "/Animal/AdcionarAnimalNovo",
      dtoRequisicao
    );
    return resposta.data;
  } catch (error) {
    throw error;
  }
};

export default {
  buscarAnimalUsuarioNaApi,
  inserirAnimal,
  alterarAnimal,
  excluirAnimal,
  buscarFotosAnimalPorUsuario,
  enviarFotosAnimalPorUsuario,
  adicionarAnimalNovo,
};
