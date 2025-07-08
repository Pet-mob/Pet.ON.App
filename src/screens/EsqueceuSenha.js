import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import Toast from "react-native-toast-message";
import apiRequisicaoAuth from "../Service/apiRequisicaoAuth";

// Função para formatar telefone (ex: (99) 99999-9999)
function formatTelefone(telefone) {
  if (!telefone) return "";
  const cleaned = telefone.replace(/\D/g, "");
  if (cleaned.length <= 10)
    return cleaned
      .replace(/(\d{2})(\d{4})(\d{0,4})/, "($1) $2-$3")
      .replace(/-$/, "");
  return cleaned
    .replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3")
    .replace(/-$/, "");
}

// Função para limpar telefone (só números)
function cleanTelefone(telefone) {
  return telefone.replace(/\D/g, "");
}

// Função para mascarar e-mail (ex: j***@g***.com)
function maskEmail(email) {
  if (!email) return "";
  const [user, domain] = email.split("@");
  const maskedUser = user[0] + "***";
  const domainParts = domain.split(".");
  const maskedDomain =
    domainParts[0][0] +
    "***" +
    (domainParts.length > 1 ? "." + domainParts.slice(1).join(".") : "");
  return maskedUser + "@" + maskedDomain;
}

const EsqueceuSenha = () => {
  const [step, setStep] = useState(1); // 1: telefone, 2: código, 3: nova senha
  const [telefone, setTelefone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState(""); // novo estado para guardar o e-mail retornado
  const navigation = useNavigation();

  // Envia SMS via backend e recebe o e-mail mascarado
  const sendSMS = async () => {
    const clean = cleanTelefone(telefone);
    if (!clean || clean.length < 10) {
      Toast.show({
        type: "error",
        text1: "Por favor, insira um número de telefone válido.",
      });
      return;
    }
    setLoading(true);
    try {
      // Supondo que a API retorna { email: "usuario@email.com" }
      const res = await apiRequisicaoAuth.enviarSMS(clean);
      if (res.data && res.data.email) {
        setUserEmail(res.data.email);
        Toast.show({
          type: "success",
          text1: `O código foi enviado para ${maskEmail(res.data.email)}.`,
        });
        setStep(2);
      } else {
        Toast.show({ type: "error", text1: "Telefone não encontrado." });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Erro ao enviar SMS." });
    } finally {
      setLoading(false);
    }
  };

  // Valida o código inserido
  const validateCode = async () => {
    const clean = cleanTelefone(telefone);
    if (!verificationCode || verificationCode.length < 4) {
      Toast.show({
        type: "error",
        text1: "Digite o código recebido por e-mail.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequisicaoAuth.validarCodigo(
        clean,
        verificationCode
      );
      if (res.data && res.data.valid) {
        Toast.show({
          type: "success",
          text1: "Agora você pode redefinir sua senha.",
        });
        setStep(3);
      } else {
        Toast.show({ type: "error", text1: "O código está incorreto." });
      }
    } catch {
      Toast.show({ type: "error", text1: "Erro ao validar código." });
    } finally {
      setLoading(false);
    }
  };

  // Redefine a senha
  const resetPassword = async () => {
    const clean = cleanTelefone(telefone);
    if (!newPassword || newPassword.length < 4) {
      Toast.show({
        type: "error",
        text1: "Por favor, insira uma nova senha válida.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequisicaoAuth.redefinirSenha(
        clean,
        verificationCode,
        newPassword
      );
      if (res.data && res.data.success) {
        Toast.show({ type: "success", text1: "Senha redefinida com sucesso!" });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: "error",
          text1: "Não foi possível redefinir a senha.",
        });
      }
    } catch {
      Toast.show({ type: "error", text1: "Erro ao redefinir senha." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {step === 1 && (
        <>
          <Text style={styles.title}>Esqueceu sua senha?</Text>
          <Text style={styles.subtitle}>
            Insira seu número de telefone para receber o código.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Número de telefone"
            keyboardType="telefone-pad"
            value={formatTelefone(telefone)}
            onChangeText={(text) => setTelefone(cleanTelefone(text))}
            maxLength={15}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={sendSMS}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Enviando..." : "Enviar Código"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 2 && (
        <>
          <Text style={styles.title}>Verificação</Text>
          <Text style={styles.subtitle}>
            Insira o código que enviamos para {maskEmail(userEmail)}.
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Código de Verificação"
            keyboardType="numeric"
            value={verificationCode}
            onChangeText={setVerificationCode}
            maxLength={6}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={validateCode}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Validando..." : "Validar Código"}
            </Text>
          </TouchableOpacity>
        </>
      )}

      {step === 3 && (
        <>
          <Text style={styles.title}>Redefinir Senha</Text>
          <Text style={styles.subtitle}>Crie uma nova senha.</Text>
          <TextInput
            style={styles.input}
            placeholder="Nova Senha"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
            maxLength={32}
          />
          <TouchableOpacity
            style={styles.button}
            onPress={resetPassword}
            disabled={loading}
          >
            <Text style={styles.buttonText}>
              {loading ? "Salvando..." : "Redefinir Senha"}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#555",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EsqueceuSenha;
