import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
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
import ExpoImageWithPlaceHolder from "../components/ExpoImageWithPlaceholder";

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
    const numeros = texto.replace(/\D/g, "");
    setTelefoneLimpo(numeros);
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
      Toast.show({
        type: "info",
        text1: "Permissão para acessar a galeria é necessária!",
      });
      setLoading(false);
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
    }
    setLoading(false);
  };

  const escolherImagemPet = async () => {
    setLoading(true);
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "info",
        text1: "Permissão para acessar a galeria é necessária!",
      });
      setLoading(false);
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
    }
    setLoading(false);
  };

  const salvar = async () => {
    try {
      setLoading(true);
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
      const novoPet = await apiRequisicaoAnimal.adicionarAnimalNovo(
        nomePet,
        raca,
        novoUsuario
      );
      if (!novoPet || novoPet <= 0) {
        throw new Error("Erro ao cadastrar o animal.");
      }
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
      Toast.show({
        type: "success",
        text1: "Cadastro realizado!",
        text2: "Seja bem-vindo à plataforma Pet.ON!",
      });
      setLoading(false);
      navigation.navigate("Login");
    } catch (error) {
      setLoading(false);
      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar",
        text2: "Tente novamente ou verifique sua conexão.",
      });
    }
  };

  const camposObrigatoriosPreenchidos =
    nome && telefoneLimpo.length >= 10 && senha.length >= 6 && nomePet && raca;

  return (
    <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Criar conta</Text>
      </View>
      <KeyboardAwareScrollView
        style={styles.bodyContainer}
        contentContainerStyle={{ paddingBottom: 30 }}
        enableOnAndroid
      >
        <Text style={styles.sectionTitle}>Seus dados</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.fotoContainer}
            onPress={escolherImagemUsuario}
            disabled={loading}
          >
            <ExpoImageWithPlaceHolder
              uri={fotoUsuario ? uriFotoUsuario : urlFotoPadrao}
              style={styles.foto}
            />
            <Text style={styles.textoFoto}>
              {fotoUsuario ? "Foto selecionada" : "Adicionar foto"}
            </Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome completo</Text>
            <TextInput
              placeholder="Digite seu nome"
              value={nome}
              onChangeText={setNome}
              style={styles.input}
              autoCapitalize="words"
              editable={!loading}
              returnKeyType="next"
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Telefone</Text>
            <TextInput
              placeholder="(99) 99999-9999"
              value={telefoneFormatado}
              onChangeText={formatarTelefone}
              style={styles.input}
              keyboardType="phone-pad"
              maxLength={15}
              editable={!loading}
            />
            <Text style={styles.inputHint}>Usaremos para contato e login</Text>
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Senha</Text>
            <TextInput
              placeholder="Crie uma senha"
              value={senha}
              onChangeText={setSenha}
              style={styles.input}
              secureTextEntry
              maxLength={20}
              editable={!loading}
            />
            <Text style={styles.inputHint}>Mínimo 6 caracteres</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Dados do seu pet</Text>
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.fotoContainer}
            onPress={escolherImagemPet}
            disabled={loading}
          >
            <ExpoImageWithPlaceHolder
              uri={fotoPet ? uriFotoPet : urlFotoPadrao}
              style={styles.foto}
            />
            <Text style={styles.textoFoto}>
              {fotoPet ? "Foto selecionada" : "Adicionar foto"}
            </Text>
          </TouchableOpacity>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do pet</Text>
            <TextInput
              placeholder="Ex: Thor"
              value={nomePet}
              onChangeText={setNomePet}
              style={styles.input}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Raça</Text>
            <TextInput
              placeholder="Ex: Golden Retriever"
              value={raca}
              onChangeText={setRaca}
              style={styles.input}
              autoCapitalize="words"
              editable={!loading}
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={salvar}
          style={[
            styles.botao,
            !camposObrigatoriosPreenchidos || loading
              ? { backgroundColor: "#bdbdbd" }
              : {},
          ]}
          disabled={!camposObrigatoriosPreenchidos || loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.botaoTexto}>Registrar</Text>
          )}
        </TouchableOpacity>
      </KeyboardAwareScrollView>
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
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  bodyContainer: {
    padding: spacing.md,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 30,
    marginBottom: 10,
    color: "#4F46E5",
  },
  section: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  inputContainer: {
    marginBottom: spacing.md,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  inputHint: {
    fontSize: 12,
    color: "#888",
    marginTop: -8,
    marginBottom: 8,
    marginLeft: 2,
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
    paddingHorizontal: 15,
    marginBottom: 5,
    height: 50,
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
});

export default RegistrarUsuarioNovo;
