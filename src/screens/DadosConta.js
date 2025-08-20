import React, { useState, useEffect } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import ExpoImageWithPlaceholder from "../components/ExpoImageWithPlaceholder";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import apiRequisicaoUsuario from "../Service/apiRequisicaoUsuario.js";
import { getUsuarioStore, setUsuarioStore } from "../store/store";
import Toast from "react-native-toast-message";

const DadosConta = () => {
  const [loading, setLoading] = useState(true);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [telefoneLimpo, setTelefoneLimpo] = useState("");
  const [foto, setFoto] = useState(null);
  const navigation = useNavigation();

  const usuarioStore = getUsuarioStore();
  const idUsuario = usuarioStore.id;
  const nomeUsuario = usuarioStore.nome;
  const telefoneUsuario = usuarioStore.telefone;
  const emailUsuario = usuarioStore.email;

  // Seleciona e envia a foto do usuário
  const selecionarFoto = async () => {
    try {
      if (Platform.OS === "web") {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = "image/*";
        input.onchange = async (event) => {
          const file = event.target.files[0];
          if (file) {
            setLoading(true);
            try {
              const resposta = await apiRequisicaoUsuario.enviarFotoUsuario(
                file,
                idUsuario
              );
              setFoto(resposta);
            } catch (error) {
              Toast.show({
                type: "error",
                text1: "Erro ao enviar foto do usuário.",
              });
            } finally {
              setLoading(false);
            }
          }
        };
        input.click();
      } else {
        const resultado = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          allowsEditing: true,
          quality: 1,
        });
        if (!resultado.canceled && resultado.assets?.length > 0) {
          setLoading(true);
          const imagem = resultado.assets[0];
          try {
            const resposta = await apiRequisicaoUsuario.enviarFotoUsuario(
              imagem,
              idUsuario
            );
            setFoto(resposta);
          } catch (error) {
            Toast.show({
              type: "error",
              text1: "Erro ao enviar foto do usuário.",
            });
          } finally {
            setLoading(false);
          }
        }
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro inesperado ao selecionar foto.",
      });
    }
  };

  // Formata o telefone para exibição e salva limpo para API
  const formatarTelefone = (texto) => {
    const numeros = texto.replace(/\D/g, "");
    setTelefoneLimpo(numeros);
    let telefoneComMascara = "";
    if (numeros.length > 0) {
      telefoneComMascara = `(${numeros.substring(0, 2)}`;
      if (numeros.length > 2) {
        telefoneComMascara += `) ${numeros.substring(2, 7)}`;
        if (numeros.length > 7) {
          telefoneComMascara += `-${numeros.substring(7, 11)}`;
        }
      }
    }
    setTelefone(telefoneComMascara);
  };

  // Altera nome e telefone do usuário
  const alterarUsuario = async () => {
    if (!nome || !telefoneLimpo) {
      Toast.show({
        type: "info",
        text1: "Por favor, preencha nome e telefone.",
      });
      return;
    }
    setLoading(true);
    try {
      const sucesso = await apiRequisicaoUsuario.alterarUsuario(
        idUsuario,
        nome,
        telefoneLimpo,
        email
      );
      if (sucesso) {
        Toast.show({
          type: "success",
          text1: "Usuário alterado com sucesso!",
        });
        const novoUsuario = {
          nome,
          telefone: telefoneLimpo,
          email,
          id: idUsuario,
        };
        setUsuarioStore(novoUsuario);
        navigation.navigate("MenuInferior", { screen: "Usuario" });
      } else {
        Toast.show({ type: "error", text1: "Falha ao alterar o usuário." });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Ocorreu um erro ao tentar alterar o usuário.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Busca a foto do usuário
  const carregarFoto = async () => {
    try {
      const resposta = await apiRequisicaoUsuario.buscarFotoUsuario(idUsuario);
      if (resposta && resposta[0]?.url) {
        setFoto(resposta[0].url);
      } else {
        setFoto(null);
      }
    } catch (error) {
      setFoto(null);
    }
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      setNome(nomeUsuario || "");
      formatarTelefone(telefoneUsuario || "");
      setEmail(emailUsuario || "");
      await carregarFoto();
      setLoading(false);
    };
    carregarDados();
  }, []);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 30}
      >
        <View style={styles.container}>
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
            </TouchableOpacity>
            <Text style={styles.title}>Dados da Conta</Text>
          </View>

          {loading ? (
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                style={{ color: "#4F46E5", fontSize: 18, fontWeight: "bold" }}
              >
                Carregando...
              </Text>
            </View>
          ) : (
            <ScrollView
              style={styles.bodyContainer}
              contentContainerStyle={{ paddingBottom: 40, flexGrow: 1 }}
              keyboardShouldPersistTaps="handled"
            >
              <TouchableOpacity
                style={styles.fotoContainer}
                onPress={selecionarFoto}
              >
                <ExpoImageWithPlaceholder
                  source={
                    foto
                      ? { uri: foto }
                      : {
                          uri: "https://azureblobpeton.blob.core.windows.net/fotos-usuarios/usuario.png?sp=r&st=2025-05-14T01:03:49Z&se=2026-05-13T09:03:49Z&spr=https&sv=2024-11-04&sr=b&sig=d%2B%2BtxK1dMnSh%2FdHeCitA%2BrbR%2BnGq7FkRh3cd5Gg1AEQ%3D",
                        }
                  }
                  style={styles.foto}
                />
                <Text style={styles.textoFoto}>Alterar Foto</Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome</Text>
                <TextInput
                  style={styles.input}
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Digite seu nome"
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={telefone}
                  onChangeText={formatarTelefone}
                  placeholder="Digite seu telefone"
                  keyboardType="phone-pad"
                  maxLength={15}
                  returnKeyType="next"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  placeholder="Digite seu email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  returnKeyType="done"
                />
              </View>

              <TouchableOpacity
                style={styles.botaoSalvar}
                onPress={alterarUsuario}
              >
                <Text style={styles.textoBotao}>Salvar Alterações</Text>
              </TouchableOpacity>
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  bodyContainer: {
    padding: 20,
  },
  fotoContainer: {
    alignItems: "center",
    marginBottom: 25,
  },
  foto: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: "#e0e0e0",
  },
  textoFoto: {
    color: "#007bff",
    marginTop: 10,
    fontSize: 16,
  },
  inputContainer: {
    marginBottom: 20,
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
  botaoSalvar: {
    backgroundColor: "#28a745",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  textoBotao: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default DadosConta;
