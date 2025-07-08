import api from "./api";

// Envia SMS para o telefone informado
const enviarSMS = async (telefone) => {
  return api.post("/Auth/enviar-codigo", {
    telefone: String(telefone),
  });
};

// Valida o código recebido por SMS
const validarCodigo = async (email, codigo) => {
  return api.post("/Auth/validar-codigo", {
    email: String(email),
    codigo: String(codigo),
  });
};

// Redefine a senha do usuário
const redefinirSenha = async (email, codigo, novaSenha) => {
  return api.post("/Auth/redefinir-senha", {
    email: String(email),
    codigo: String(codigo),
    novaSenha: String(novaSenha),
  });
};

export default {
  enviarSMS,
  validarCodigo,
  redefinirSenha,
};
