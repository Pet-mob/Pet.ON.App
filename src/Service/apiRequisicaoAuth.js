import api from "./api";

// Envia SMS para o telefone informado
const enviarSMS = async (phoneNumber) => {
  return api.post("/auth/send-sms", { phoneNumber });
};

// Valida o código recebido por SMS
const validarCodigo = async (phoneNumber, code) => {
  return api.post("/auth/validate-code", { phoneNumber, code });
};

// Redefine a senha do usuário
const redefinirSenha = async (phoneNumber, code, newPassword) => {
  return api.post("/auth/reset-password", { phoneNumber, code, newPassword });
};

export default {
  enviarSMS,
  validarCodigo,
  redefinirSenha,
};
