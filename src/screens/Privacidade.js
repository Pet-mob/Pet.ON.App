import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import apiRequisicaoUsuario from "../Service/apiRequisicaoUsuario.js";
import { getUsuarioStore } from "../store/store";
import Toast from "react-native-toast-message";

const Privacidade = () => {
  const [senhaAtual, setSenhaAtual] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigation = useNavigation();
  const usuarioStore = getUsuarioStore();
  const idUsuario = usuarioStore.id;

  // Função para validar critérios da senha
  function validarSenha(senha) {
    const minLength = senha.length >= 8;
    const hasUpper = /[A-Z]/.test(senha);
    const hasLower = /[a-z]/.test(senha);
    const hasNumber = /[0-9]/.test(senha);
    const hasSpecial = /[^A-Za-z0-9]/.test(senha);
    return minLength && hasUpper && hasLower && hasNumber && hasSpecial;
  }

  const alterarSenha = async () => {
    if (!senhaAtual || !novaSenha || !confirmarSenha) {
      Toast.show({
        type: "info",
        text1: "Por favor, preencha todos os campos.",
      });
      return;
    }

    if (!validarSenha(novaSenha)) {
      Toast.show({
        type: "info",
        text1:
          "A nova senha deve ter pelo menos 8 caracteres, incluindo letra maiúscula, minúscula, número e caractere especial.",
      });
      return;
    }

    if (novaSenha !== confirmarSenha) {
      Toast.show({ type: "info", text1: "As senhas não coincidem." });
      return;
    }

    try {
      const sucesso = await apiRequisicaoUsuario.alterarSenhaUsuario(
        novaSenha,
        idUsuario
      );
      if (sucesso) {
        Toast.show({ type: "success", text1: "Senha alterada com sucesso!" });
        navigation.navigate("MenuInferior", { screen: "Usuario" });
      } else {
        Toast.show({
          type: "error",
          text1: "Falha ao alterar a senha. Verifique a senha atual.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ocorreu um erro ao tentar alterar a senha.",
      });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={26} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Privacidade</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.bodyContainer}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Senha Atual:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={senhaAtual}
              onChangeText={setSenhaAtual}
              placeholder="Digite sua senha atual"
              secureTextEntry={!showCurrentPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <Ionicons
                name={showCurrentPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Nova Senha:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={novaSenha}
              onChangeText={setNovaSenha}
              placeholder="Digite a nova senha"
              secureTextEntry={!showNewPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowNewPassword(!showNewPassword)}
            >
              <Ionicons
                name={showNewPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
          <View style={styles.passwordRulesBox}>
            <Text style={styles.passwordRulesTitle}>
              Sua senha deve conter:
            </Text>
            <Text style={styles.passwordRules}>• Pelo menos 8 caracteres</Text>
            <Text style={styles.passwordRules}>• 1 letra maiúscula (A-Z)</Text>
            <Text style={styles.passwordRules}>• 1 letra minúscula (a-z)</Text>
            <Text style={styles.passwordRules}>• 1 número (0-9)</Text>
            <Text style={styles.passwordRules}>
              • 1 caractere especial (! @ # $ % & * ?)
            </Text>
          </View>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirmar Nova Senha:</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={styles.passwordInput}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Confirme a nova senha"
              secureTextEntry={!showConfirmPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-off-outline" : "eye-outline"}
                size={24}
                color="#666"
              />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.botaoSalvar} onPress={alterarSenha}>
          <Text style={styles.textoBotao}>Salvar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 50,
    // padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  bodyContainer: {
    padding: 20,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  passwordInput: {
    flex: 1,
    padding: 12,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 10,
  },
  passwordRulesBox: {
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    padding: 10,
    marginTop: 10,
  },
  passwordRulesTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 8,
  },
  passwordRules: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  botaoSalvar: {
    backgroundColor: "#28A745",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  textoBotao: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Privacidade;
