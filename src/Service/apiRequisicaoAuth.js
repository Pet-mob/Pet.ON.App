import api from "./api";

// Envia SMS para o telefone informado
const enviarSMS = async (telefone) => {
  const resposta = await api.post("/Auth/enviar-codigo", {
    telefone: String(telefone),
  });
  return resposta.data;
};

// Valida o código recebido por SMS
const validarCodigo = async (email, codigo) => {
  const resposta = await api.post("/Auth/validar-codigo", {
    email: String(email),
    codigo: String(codigo),
  });
  return resposta.data;
};

// Redefine a senha do usuário
const redefinirSenha = async (email, codigo, novaSenha) => {
  const resposta = await api.post("/Auth/redefinir-senha", {
    email: String(email),
    codigo: String(codigo),
    novaSenha: String(novaSenha),
  });
  return resposta.data;
};

export default {
  enviarSMS,
  validarCodigo,
  redefinirSenha,
};
