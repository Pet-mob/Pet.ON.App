import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import Toast from "react-native-toast-message";
import apiRequisicaoAuth from "../Service/apiRequisicaoAuth";
import Icon from "react-native-vector-icons/Ionicons";

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

// Função para validar critérios da senha
function validarSenha(senha) {
  const minLength = senha.length >= 8;
  const hasUpper = /[A-Z]/.test(senha);
  const hasLower = /[a-z]/.test(senha);
  const hasNumber = /[0-9]/.test(senha);
  const hasSpecial = /[^A-Za-z0-9]/.test(senha);
  return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
}

const EsqueceuSenha = () => {
  const [step, setStep] = useState(1); // 1: telefone, 2: código, 3: nova senha
  const [telefone, setTelefone] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [userEmail, setUserEmail] = useState("");
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
      const res = await apiRequisicaoAuth.enviarSMS(clean);
      if (res.data && res.data.sucesso) {
        if (res.data.email) {
          setUserEmail(res.data.email);
          Toast.show({
            type: "success",
            text1:
              res.data.mensagem || "Código enviado para o e-mail cadastrado.",
          });
          setStep(2);
        } else {
          Toast.show({
            type: "error",
            text1:
              "Não foi possível recuperar o e-mail cadastrado. Tente novamente.",
          });
        }
      } else {
        Toast.show({
          type: "error",
          text1: res.data.mensagem || "Telefone não encontrado.",
        });
      }
    } catch (e) {
      Toast.show({ type: "error", text1: "Erro ao enviar SMS." });
    } finally {
      setLoading(false);
    }
  };

  // Valida o código inserido
  const validateCode = async () => {
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
        userEmail,
        verificationCode
      );
      if (res.data && res.data.valido) {
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
    if (!newPassword || newPassword.length < 8) {
      Toast.show({
        type: "error",
        text1: "A senha deve ter pelo menos 8 caracteres.",
      });
      return;
    }
    if (!validarSenha(newPassword)) {
      Toast.show({
        type: "error",
        text1:
          "A senha deve conter letra maiúscula, minúscula, número e caractere especial.",
      });
      return;
    }
    setLoading(true);
    try {
      const res = await apiRequisicaoAuth.redefinirSenha(
        userEmail,
        verificationCode,
        newPassword
      );
      if (res.data && res.data.sucesso) {
        Toast.show({
          type: "success",
          text1: res.data.mensagem || "Senha redefinida com sucesso!",
        });
        navigation.navigate("Login");
      } else {
        Toast.show({
          type: "error",
          text1: res.data.mensagem || "Não foi possível redefinir a senha.",
        });
      }
    } catch {
      Toast.show({ type: "error", text1: "Erro ao redefinir senha." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Login")}
            style={styles.backButton}
          >
            <Icon name="chevron-back-outline" size={28} color="#007aff" />
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.content}>
          {step === 1 && (
            <>
              <Text style={styles.title}>Esqueceu sua senha?</Text>
              <Text style={styles.subtitle}>
                Insira seu número de telefone para receber o código.
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Número de telefone"
                keyboardType="phone-pad"
                value={formatTelefone(telefone)}
                onChangeText={(text) => setTelefone(cleanTelefone(text))}
                maxLength={15}
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
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
                Insira o código que enviamos para{" "}
                <Text style={{ fontWeight: "bold" }}>
                  {maskEmail(userEmail)}
                </Text>
                .
              </Text>
              <TextInput
                style={styles.input}
                placeholder="Código de Verificação"
                keyboardType="numeric"
                value={verificationCode}
                onChangeText={setVerificationCode}
                maxLength={6}
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
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
              <View style={styles.passwordRulesBox}>
                <Text style={styles.passwordRulesTitle}>
                  Sua senha deve conter:
                </Text>
                <Text style={styles.passwordRules}>
                  • Pelo menos 8 caracteres
                </Text>
                <Text style={styles.passwordRules}>• 1 letra maiúscula</Text>
                <Text style={styles.passwordRules}>• 1 letra minúscula</Text>
                <Text style={styles.passwordRules}>• 1 número</Text>
                <Text style={styles.passwordRules}>• 1 caractere especial</Text>
              </View>
              <TextInput
                style={styles.input}
                placeholder="Nova Senha"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                maxLength={100}
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
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
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "ios" ? 50 : 30,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 0,
  },
  backButtonText: {
    color: "#007aff",
    fontSize: 16,
    marginLeft: 4,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
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
    padding: 12,
    marginBottom: 20,
    backgroundColor: "#F9F9F9",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007bff",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  passwordRulesBox: {
    marginBottom: 12,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    padding: 10,
  },
  passwordRulesTitle: {
    fontWeight: "bold",
    fontSize: 15,
    marginBottom: 4,
    color: "#555",
  },
  passwordRules: {
    fontSize: 14,
    color: "#888",
    marginBottom: 2,
    marginLeft: 4,
  },
});

export default EsqueceuSenha;
