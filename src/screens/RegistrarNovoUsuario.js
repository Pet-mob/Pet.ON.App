import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import apiRequisicaoAnimal from "../Service/apiRequisicaoAnimal.js";
import apiRequisicaoUsuario from "../Service/apiRequisicaoUsuario.js";
import { useNavigation } from "@react-navigation/native";
import { colors, spacing, fontSizes, radii } from "../theme/theme1.js";
import Toast from "react-native-toast-message";
import ExpoImageWithPlaceHolder from "../components/ExpoImageWithPlaceholder";
import KeyboardAvoidingWrapper from "../components/KeyboardAvoidingWrapper";

const RegistrarUsuarioNovo = () => {
  const navigation = useNavigation();
  const urlFotoPadrao =
    "https://azureblobpeton.blob.core.windows.net/fotos-usuarios/usuario.png?sp=r&st=2025-05-14T01:03:49Z&se=2026-05-13T09:03:49Z&spr=https&sv=2024-11-04&sr=b&sig=d%2B%2BtxK1dMnSh%2FdHeCitA%2BrbR%2BnGq7FkRh3cd5Gg1AEQ%3D";
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Dados do usuário
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [telefoneFormatado, setTelefoneFormatado] = useState("");
  const [telefoneLimpo, setTelefoneLimpo] = useState("");
  const [senha, setSenha] = useState("");
  const [fotoUsuario, setFotoUsuario] = useState(null);
  const [uriFotoUsuario, setUriFotoUsuario] = useState("");
  const [jsonString, setJsonString] = useState("");
  // Dados dos pets (array de pets)
  const [pets, setPets] = useState([
    {
      nome: "",
      raca: "",
      idPorte: null,
      observacoes: "",
      foto: null,
      uriFoto: "",
    },
  ]);

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

  // Funções para manipular pets
  const adicionarPet = () => {
    setPets([
      ...pets,
      {
        nome: "",
        raca: "",
        idPorte: null,
        observacoes: "",
        foto: null,
        uriFoto: "",
      },
    ]);
  };

  const removerPet = (index) => {
    if (pets.length === 1) return; // Sempre pelo menos 1 pet
    setPets(pets.filter((_, i) => i !== index));
  };

  const atualizarCampoPet = (index, campo, valor) => {
    const novosPets = [...pets];
    novosPets[index][campo] = valor;
    setPets(novosPets);
  };

  const escolherImagemPet = async (index) => {
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
      const novosPets = [...pets];
      novosPets[index].foto = resultado.assets[0];
      novosPets[index].uriFoto = resultado.assets[0].uri;
      setPets(novosPets);
    }
    setLoading(false);
  };

  // Validação de email
  const validarEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Função para validar foto do usuário
  const validarFotoUsuario = (foto) => {
    if (!foto) return false; // Se não houver foto, retorna falso
    const tamanhoMaximo = 5 * 1024 * 1024; // 5MB
    const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];
    if (foto.fileSize > tamanhoMaximo) {
      Toast.show({
        type: "error",
        text1: "Foto muito grande",
        text2: "O tamanho máximo permitido é 5MB.",
      });
      return false;
    }
    if (!tiposPermitidos.includes(foto.mimeType)) {
      Toast.show({
        type: "error",
        text1: "Tipo de arquivo inválido",
        text2: "Apenas imagens JPEG e PNG são permitidas.",
      });
      return false;
    }
    return true;
  };

  // Função para validar foto do pet
  const validarFotoPet = (foto) => {
    if (!foto) return false; // Se não houver foto, retorna falso
    const tamanhoMaximo = 5 * 1024 * 1024; //5MB
    const tiposPermitidos = ["image/jpeg", "image/png", "image/jpg"];
    if (foto.fileSize > tamanhoMaximo) {
      Toast.show({
        type: "error",
        text1: "Foto do pet muito grande",
        text2: "O tamanho máximo permitido é 5MB.",
      });
      return false;
    }
    if (!tiposPermitidos.includes(foto.mimeType)) {
      Toast.show({
        type: "error",
        text1: "Tipo de arquivo inválido",
        text2: "Apenas imagens JPEG e PNG são permitidas.",
      });
      return false;
    }
    return true;
  };

  // Função para mostrar mensagens de erro
  const mostrarErro = (mensagem) => {
    Toast.show({ type: "error", text1: mensagem });
  };

  // Função para validar todos os campos antes de executar a transação
  const validarTudoAntesDaExecucao = async () => {
    if (!validarEmail(email)) {
      mostrarErro("Email inválido");
      return false;
    }

    if (!validarFotoUsuario(fotoUsuario)) {
      mostrarErro("Selecione uma foto de usuário válida.");
      return false;
    }

    const telefoneExiste = await validarTelefoneCadastrado(telefoneLimpo);
    if (telefoneExiste) {
      mostrarErro("Telefone já cadastrado!");
      return false;
    }

    for (const pet of pets) {
      if (!pet.nome || !pet.raca || !pet.idPorte) {
        mostrarErro("Preencha todos os campos obrigatórios do pet.");
        return false;
      }

      if (!validarFotoPet(pet.foto)) {
        mostrarErro("Selecione uma foto de pet válida.");
        return false;
      }
    }

    return true;
  };

  // Função para executar a transação de cadastro
  const executarTransacao = async () => {
    const novoUsuario = await apiRequisicaoUsuario.inserirUsuario(
      nome,
      telefoneLimpo,
      senha,
      email
    );

    if (!novoUsuario || novoUsuario <= 0) {
      throw new Error("Erro ao cadastrar usuário.");
    }

    if (fotoUsuario) {
      const respostaUsuario = await apiRequisicaoUsuario.enviarFotoUsuario(
        fotoUsuario,
        novoUsuario
      );

      if (!respostaUsuario) {
        throw new Error("Erro ao enviar foto do usuário.");
      }

      setUriFotoUsuario(respostaUsuario);
    }

    for (const pet of pets) {
      const novoPet = await apiRequisicaoAnimal.adicionarAnimalNovo(
        pet.nome,
        pet.raca,
        novoUsuario,
        pet.idPorte,
        pet.observacoes
      );

      if (!novoPet || novoPet <= 0) {
        throw new Error("Erro ao cadastrar o animal.");
      }

      if (pet.foto) {
        const respostaAnimal =
          await apiRequisicaoAnimal.enviarFotosAnimalPorUsuario(
            pet.foto,
            novoUsuario,
            novoPet
          );

        if (!respostaAnimal) {
          throw new Error("Erro ao enviar foto do animal.");
        }
      }
    }

    return true;
  };

  // Função para salvar os dados do usuário e pets
  const salvar = async () => {
    setLoading(true);
    try {
      const validado = await validarTudoAntesDaExecucao();

      if (!validado) {
        setLoading(false);
        return;
      }

      await executarTransacao();

      Toast.show({
        type: "success",
        text1: "Cadastro realizado!",
        text2: "Seja bem-vindo à plataforma PetMob!",
      });

      navigation.navigate("Login");
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao cadastrar",
        text2: error.message || "Tente novamente ou verifique sua conexão.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Função para validar telefone cadastrado
  async function validarTelefoneCadastrado(telefone) {
    if (!telefone || telefone.length < 10) {
      return false;
    }
    var telefoneLimpo = telefone.replace(/\D/g, "");

    const telefoneValidado =
      await apiRequisicaoUsuario.validarTelefoneCadastrado(telefoneLimpo);
    return telefoneValidado;
  }

  const camposObrigatoriosPreenchidos =
    nome &&
    validarEmail(email) &&
    telefoneLimpo.length >= 10 &&
    pets.every((pet) => pet.nome && pet.raca && pet.idPorte);

  return (
    <KeyboardAvoidingWrapper>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.title}>Criar conta</Text>
        </View>

        <View style={styles.bodyContainer}>
          <Text style={styles.sectionTitle}>Seus dados</Text>
          <View style={styles.section}>
            <TouchableOpacity
              style={styles.fotoContainer}
              onPress={escolherImagemUsuario}
              disabled={loading}
            >
              <ExpoImageWithPlaceHolder
                source={
                  fotoUsuario ? { uri: uriFotoUsuario } : { uri: urlFotoPadrao }
                }
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
              <Text style={styles.label}>Email</Text>
              <TextInput
                placeholder="Digite seu email"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
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
              <Text style={styles.inputHint}>
                Usaremos para contato e login
              </Text>
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  placeholder="Crie uma senha"
                  value={senha}
                  onChangeText={setSenha}
                  style={[styles.passwordInput, { color: "#333" }]}
                  secureTextEntry={!showPassword}
                  maxLength={20}
                  editable={!loading}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.passwordRulesBox}>
                <Text style={styles.passwordRulesTitle}>
                  Para garantir a segurança da sua conta, sugerimos que a sua
                  nova senha deve atender aos seguintes critérios:
                </Text>
                <Text style={styles.passwordRules}>
                  • Pelo menos 8 caracteres
                </Text>
                <Text style={styles.passwordRules}>• 1 letra maiúscula</Text>
                <Text style={styles.passwordRules}>• 1 letra minúscula</Text>
                <Text style={styles.passwordRules}>• 1 número</Text>
                <Text style={styles.passwordRules}>• 1 caractere especial</Text>
              </View>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Dados do(s) seu(s) pet(s)</Text>
          {pets.map((pet, index) => (
            <View key={index} style={styles.section}>
              <TouchableOpacity
                style={styles.fotoContainer}
                onPress={() => escolherImagemPet(index)}
                disabled={loading}
              >
                <ExpoImageWithPlaceHolder
                  source={
                    pet.foto ? { uri: pet.uriFoto } : { uri: urlFotoPadrao }
                  }
                  style={styles.foto}
                />
                <Text style={styles.textoFoto}>
                  {pet.foto ? "Foto selecionada" : "Adicionar foto"}
                </Text>
              </TouchableOpacity>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome do pet</Text>
                <TextInput
                  placeholder="Ex: Thor"
                  value={pet.nome}
                  onChangeText={(valor) =>
                    atualizarCampoPet(index, "nome", valor)
                  }
                  style={styles.input}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Raça</Text>
                <TextInput
                  placeholder="Ex: Golden Retriever"
                  value={pet.raca}
                  onChangeText={(valor) =>
                    atualizarCampoPet(index, "raca", valor)
                  }
                  style={styles.input}
                  autoCapitalize="words"
                  editable={!loading}
                />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Porte</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  {[
                    { label: "Pequeno", value: 1 },
                    { label: "Médio", value: 2 },
                    { label: "Grande", value: 3 },
                  ].map((opcao) => (
                    <TouchableOpacity
                      key={opcao.value}
                      style={[
                        styles.porteButton,
                        pet.idPorte === opcao.value
                          ? styles.porteButtonSelected
                          : null,
                      ]}
                      onPress={() =>
                        atualizarCampoPet(index, "idPorte", opcao.value)
                      }
                      disabled={loading}
                    >
                      <Text
                        style={[
                          styles.porteButtonText,
                          pet.idPorte === opcao.value
                            ? styles.porteButtonTextSelected
                            : null,
                        ]}
                      >
                        {opcao.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Observações</Text>
                <TextInput
                  placeholder="Observações sobre o pet (opcional)"
                  value={pet.observacoes}
                  onChangeText={(valor) =>
                    atualizarCampoPet(index, "observacoes", valor)
                  }
                  style={styles.input}
                  editable={!loading}
                />
              </View>

              {pets.length > 1 && (
                <TouchableOpacity
                  onPress={() => removerPet(index)}
                  disabled={loading}
                  style={{ alignSelf: "flex-end", marginBottom: 10 }}
                >
                  <Text style={{ color: "red" }}>Remover pet</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
          <TouchableOpacity
            onPress={adicionarPet}
            disabled={loading}
            style={{ alignItems: "center", marginBottom: 10 }}
          >
            <Text style={{ color: "#4F46E5", fontWeight: "bold" }}>
              + Adicionar outro pet
            </Text>
          </TouchableOpacity>

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
        </View>
      </View>
    </KeyboardAvoidingWrapper>
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
  porteButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#4F46E5",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  porteButtonSelected: {
    backgroundColor: "#4F46E5",
  },
  porteButtonText: {
    color: "#4F46E5",
    fontWeight: "bold",
  },
  porteButtonTextSelected: {
    color: "#fff",
  },
  passwordRulesBox: {
    backgroundColor: "#F3F4F6",
    borderRadius: 8,
    padding: 10,
    marginTop: 4,
    marginBottom: 8,
  },
  passwordRulesTitle: {
    fontWeight: "bold",
    color: "#4F46E5",
    marginBottom: 2,
    fontSize: 13,
  },
  passwordRules: {
    color: "#333",
    fontSize: 13,
    marginLeft: 2,
  },
  passwordInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 15,
    height: 50,
  },
  eyeIcon: {
    padding: 10,
  },
});

export default RegistrarUsuarioNovo;
