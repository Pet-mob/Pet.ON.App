import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import apiRequisicaoAnimal from "../Service/apiRequisicaoAnimal.js";
import apiRequisicaoUsuario from "../Service/apiRequisicaoUsuario.js";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, fontSizes, radii } from "../theme/theme1.js";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

const RegistrarUsuarioNovo = () => {
  const navigation = useNavigation();
  const urlFotoPadrao =
    "https://azureblobpeton.blob.core.windows.net/fotos-usuarios/usuario.png?sp=r&st=2025-05-14T01:03:49Z&se=2026-05-13T09:03:49Z&spr=https&sv=2024-11-04&sr=b&sig=d%2B%2BtxK1dMnSh%2FdHeCitA%2BrbR%2BnGq7FkRh3cd5Gg1AEQ%3D";
  const [loading, setLoading] = useState(false);

  // Dados do usuário
  const [nome, setNome] = useState("");
  const [telefoneFormatado, setTelefoneFormatado] = useState("");
  const [telefoneLimpo, setTelefoneLimpo] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [uriFotoUsuario, setUriFotoUsuario] = useState("");

  // Dados do pet
  const [nomePet, setNomePet] = useState("");
  const [raca, setRaca] = useState("");
  const [fotoPet, setFotoPet] = useState(null);
  const [uriFotoPet, setUriFotoPet] = useState("");

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

  const escolherImagemUsuario = async () => {
    setLoading(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setFotoUsuario(resultado.assets[0]);
      setUriFotoUsuario(resultado.assets[0].uri);
      setLoading(false);
    }
  };

  const escolherImagemPet = async () => {
    setLoading(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      alert("Permissão para acessar a galeria é necessária!");
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled) {
      setFotoPet(resultado.assets[0]);
      setUriFotoPet(resultado.assets[0].uri);
      setLoading(false);
    }
  };

  const salvar = async () => {
    try {
      setLoading(true);
      // 1. Cadastrar usuário
      const novoUsuario = await apiRequisicaoUsuario.inserirUsuario(
        nome,
        telefoneLimpo,
        senha
      );
      if (!novoUsuario || novoUsuario <= 0) {
        throw new Error("Erro ao cadastrar usuário.");
      }
      if (fotoUsuario) {
        const respostaUsuario = await apiRequisicaoUsuario.enviarFotoUsuario(
          fotoUsuario,
          novoUsuario
        );
        if (!respostaUsuario)
          throw new Error("Erro ao enviar foto do usuário.");
        setUriFotoUsuario(respostaUsuario);
      }

      // 3. Cadastrar pet
      const novoPet = await apiRequisicaoAnimal.adicionarAnimalNovo(
        nomePet,
        raca,
        novoUsuario
      );
      if (!novoPet || novoPet <= 0) {
        throw new Error("Erro ao cadastrar o animal.");
      }

      // 4. Enviar foto do pet (se existir)
      if (fotoPet) {
        const respostaAnimal =
          await apiRequisicaoAnimal.enviarFotosAnimalPorUsuario(
            fotoPet,
            novoUsuario,
            novoPet
          );
        if (!respostaAnimal) throw new Error("Erro ao enviar foto do animal.");
        setUriFotoPet(respostaAnimal);
      }

      // ✅ Toast de sucesso
      Toast.show({
        type: "success",
        text1: "Cadastro realizado!",
        text2: "Seja bem-vindo à plataforma Pet.ON!",
      });
      setLoading(false);
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      // ❌ Toast de erro
      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar",
        text2: "Tente novamente ou verifique sua conexão.",
      });
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Criar conta</Text>
      </View>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <KeyboardAwareScrollView
          style={styles.bodyContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
        >
          <Text style={styles.subtitulo}>Cadastro do Usuário</Text>
          <TouchableOpacity
            style={styles.fotoContainer}
            onPress={() => escolherImagemUsuario()}
          >
            <Image
              source={
                fotoUsuario ? { uri: uriFotoUsuario } : { uri: urlFotoPadrao }
              }
              style={styles.foto}
            />
            <Text style={styles.textoFoto}>Selecionar Foto</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Nome"
            value={nome}
            onChangeText={setNome}
            style={styles.input}
          />
          <TextInput
            placeholder="Telefone"
            value={telefoneFormatado}
            onChangeText={formatarTelefone}
            style={styles.input}
            keyboardType="phone-pad"
            placeholderTextColor="#aaa"
          />
          <TextInput
            placeholder="Senha"
            value={senha}
            onChangeText={setSenha}
            style={styles.input}
            secureTextEntry
          />

          <Text style={styles.subtitulo}>Cadastro do Pet</Text>

          <TouchableOpacity
            style={styles.fotoContainer}
            onPress={() => escolherImagemPet()}
          >
            <Image
              source={fotoPet ? { uri: uriFotoPet } : { uri: urlFotoPadrao }}
              style={styles.foto}
            />
            <Text style={styles.textoFoto}>Selecionar Foto</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="Nome do Pet"
            value={nomePet}
            onChangeText={setNomePet}
            style={styles.input}
          />
          <TextInput
            placeholder="Raça do Pet"
            value={raca}
            onChangeText={setRaca}
            style={styles.input}
          />

          <TouchableOpacity onPress={salvar} style={styles.botao}>
            <Text style={styles.botaoTexto}>Registrar</Text>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
      )}
    </ScrollView>
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
    padding: spacing.md,
  },
  inputContainer: {
    marginBottom: spacing.md,
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
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  // container: {
  //     flex: 1,
  //     padding: 20,
  //     backgroundColor: "#FFF",
  // },
  subtitulo: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 25,
  },
  // input: {
  //     height: 50,
  //     borderWidth: 1,
  //     borderColor: "#CCC",
  //     borderRadius: 10,
  //     paddingHorizontal: 15,
  //     marginBottom: 15,
  //     backgroundColor: "#FFF",
  // },
  botao: {
    backgroundColor: "#4CAF50",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  botaoTexto: {
    color: "#FFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  imagePicker: {
    width: 150,
    height: 150,
    borderRadius: radii.full,
    // borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CCC",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    // height: 120,
    // backgroundColor: '#e0e0e0',
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  imageText: {
    marginTop: spacing.sm,
    color: colors.secondary,
    fontWeight: "500",
    // color: "#999",
  },
  fotoContainer: {
    alignItems: "center",
    marginBottom: 15,
  },
  foto: {
    width: 120,
    height: 120,
    borderRadius: radii.full,
    backgroundColor: "#e0e0e0",
  },
  textoFoto: {
    marginTop: spacing.sm,
    color: colors.secondary,
    fontWeight: "500",
  },
});

export default RegistrarUsuarioNovo;
