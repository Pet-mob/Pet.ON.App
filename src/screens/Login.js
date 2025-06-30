import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { setUsuarioStore } from "../store/store";
import apiRequisicaoUsuario from "../Service/apiRequisicaoUsuario.js";
import Toast from "react-native-toast-message";
import { Image as ExpoImage } from "expo-image";

const TelaLogin = () => {
  const navigation = useNavigation();
  const [telefoneFormatado, setTelefoneFormatado] = useState("");
  const [telefoneLimpo, setTelefoneLimpo] = useState("");
  const [Senha, setSenha] = useState("");
  const [loading, setLoading] = useState(false);

  const placeholderImg = require("../../assets/placeholder.png");

  const formatarTelefone = (texto) => {
    // Remove tudo que não é número
    const numeros = texto.replace(/\D/g, "");

    // Salva o valor limpo para envio ao backend
    setTelefoneLimpo(numeros);

    // Aplica a máscara
    let telefoneComMascara = "";
    if (numeros.length <= 2) {
      telefoneComMascara = `(${numeros}`;
    } else if (numeros.length <= 6) {
      telefoneComMascara = `(${numeros.substring(0, 2)}) ${numeros.substring(
        2
      )}`;
    } else if (numeros.length <= 10) {
      telefoneComMascara = `(${numeros.substring(0, 2)}) ${numeros.substring(
        2,
        7
      )}-${numeros.substring(7)}`;
    } else {
      telefoneComMascara = `(${numeros.substring(0, 2)}) ${numeros.substring(
        2,
        7
      )}-${numeros.substring(7, 11)}`;
    }

    setTelefoneFormatado(telefoneComMascara);
  };

  const handleLogin = async () => {
    if (!telefoneLimpo || !Senha) {
      alert("Preencha todos os campos!");
      return;
    }
    setLoading(true); // <- INICIA LOADING
    try {
      const resposta = await apiRequisicaoUsuario.validarLogin(
        telefoneLimpo,
        Senha
      );

      if (resposta.loginAtivado) {
        setUsuarioStore(resposta.buscarUsuarioResDto);
        navigation.navigate("MenuInferior");
      } else {
        Toast.show({
          type: "error",
          text1: "Credenciais inválidas...",
          text2: "Tente novamente ou verifique sua conexão.",
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao buscar acesso.",
        text2: "Tente novamente ou verifique sua conexão.",
      });
    } finally {
      setLoading(false); // <- FINALIZA LOADING
    }
  };

  const redirecionarParaRegistraNovoUsuario = () => {
    navigation.navigate("RegistrarNovoUsuario");
  };

  const handleEsqueceuSenha = () => {
    navigation.navigate("EsqueceuSenha");
  };

  return (
    <KeyboardAvoidingView
      style={estilos.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }}>
        <View style={estilos.containerInterno}>
          <View style={estilos.containerLogo}>
            <ExpoImage
              source={require("../../assets/LogoGrande.png")}
              style={estilos.logo}
              contentFit="contain"
              transition={300}
              placeholder={placeholderImg}
            />
          </View>

          <Text style={estilos.textoBoasVindas}>Bem-vindo</Text>

          <TextInput
            style={estilos.input}
            placeholder="Digite seu celular"
            value={telefoneFormatado}
            onChangeText={formatarTelefone}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />
          <TextInput
            style={estilos.input}
            placeholder="Digite sua senha"
            value={Senha}
            onChangeText={setSenha}
            secureTextEntry
            placeholderTextColor="#aaa"
          />

          <TouchableOpacity
            style={[estilos.botao, loading && { backgroundColor: "#aaa" }]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <Text style={estilos.textoBotao}>Entrar</Text>
            )}
          </TouchableOpacity>

          <View style={estilos.containerLinks}>
            <TouchableOpacity
              style={estilos.link}
              onPress={handleEsqueceuSenha}
            >
              <Text style={estilos.link}>Esqueceu a senha?</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={redirecionarParaRegistraNovoUsuario}>
              <Text style={estilos.link}>Registrar-se</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </KeyboardAvoidingView>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  containerInterno: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  containerLogo: {
    marginBottom: 20,
    alignItems: "center",
  },
  logo: {
    width: 230,
    height: 230,
  },
  textoBoasVindas: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#F9F9F9",
    fontSize: 16,
    // shadowColor: "#000",
    // shadowOpacity: 0.1,
    // shadowOffset: { width: 0, height: 2 },
    // shadowRadius: 5,
    elevation: 2, // Para Android
    // boxShadow substitui shadowColor, shadowOpacity, shadowOffset, shadowRadius
    boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
  },
  botao: {
    width: "100%",
    height: 50,
    backgroundColor: "#28A745",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  textoBotao: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  containerLinks: {
    marginTop: 10,
    alignItems: "center",
  },
  link: {
    color: "#007BFF",
    fontSize: 14,
    textAlign: "center",
    marginVertical: 5,
  },
});

export default TelaLogin;
