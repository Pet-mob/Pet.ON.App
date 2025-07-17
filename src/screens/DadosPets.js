import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Platform,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { getUsuarioStore } from "../store/store";
import apiRequisicaoAnimal from "../Service/apiRequisicaoAnimal.js";
import { colors, spacing, fontSizes, radii } from "../theme/theme1.js";
import ExpoImageWithPlaceholder from "../components/ExpoImageWithPlaceholder";
import Toast from "react-native-toast-message";

const DadosPets = () => {
  const [loading, setLoading] = useState(true);
  const [idAnimal, setIdAnimal] = useState("");
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [raca, setRaca] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [foto, setFoto] = useState(null);
  // porte: 1 - Pequeno, 2 - Médio, 3 - Grande
  const [idPorte, setIdPorte] = useState("");
  const [arquivoFoto, setArquivoFoto] = useState({});
  const [listaDePets, setListaDePets] = useState([]);
  const navigation = useNavigation();
  const usuarioStore = getUsuarioStore();
  const idUsuario = usuarioStore.id;

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [petsApi] = await Promise.all([
        apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(idUsuario),
      ]);
      // Carregar fotos dos pets
      const fotos = await apiRequisicaoAnimal.buscarFotosAnimalPorUsuario(
        idUsuario
      );
      const petsComFoto = petsApi.map((pet) => {
        const foto = fotos?.find((f) => f.idAnimal === pet.idAnimal);
        return {
          ...pet,
          imagem: foto?.url,
        };
      });
      setListaDePets(petsComFoto);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar serviços ou pets.",
      });
    } finally {
      setLoading(false);
    }
  };

  const buscarPetsPorUsuario = async (idUsuarioParam) => {
    try {
      const resposta = await apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(
        idUsuarioParam
      );
      if (resposta) {
        setListaDePets(resposta);
      } else {
        Toast.show({ type: "info", text1: "Nenhum pet cadastrado." });
      }
    } catch (error) {
      Toast.show({ type: "error", text1: "Erro ao carregar dados dos pets." });
    }
  };

  const enviarFotoDetalhadamente = async (idGeradoAnimal) => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = "image/*";
      input.onchange = async (event) => {
        const file = event.target.files[0];
        if (file) {
          try {
            const resposta =
              await apiRequisicaoAnimal.enviarFotosAnimalPorUsuario(
                file,
                idUsuario,
                idGeradoAnimal
              );
            setFoto(resposta);
            return resposta;
          } catch (error) {
            console.error("Erro ao enviar foto do animal:", error);
          }
        }
      };
      input.click();
    } else {
      if (arquivoFoto) {
        try {
          const resposta =
            await apiRequisicaoAnimal.enviarFotosAnimalPorUsuario(
              arquivoFoto,
              idUsuario,
              idGeradoAnimal
            );
          setFoto(resposta);
          return resposta;
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Erro ao enviar foto do animal.",
          });
        }
      }
    }
  };

  const selecionarFoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "info",
        text1: "Precisamos de acesso à galeria para alterar a foto.",
      });
      return;
    }

    const resultado = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!resultado.canceled && resultado.assets?.length > 0) {
      setFoto(resultado.assets[0].uri);
      setArquivoFoto(resultado.assets[0]);
    }
  };

  const salvarPet = async () => {
    if (!nome || !raca || !idPorte) {
      Toast.show({
        type: "info",
        text1: "Preencha todos os campos obrigatórios",
      });
      return;
    }

    let porteNumero = idPorte;
    let idadeNumero = idade ? parseInt(idade, 10) : 0;

    setLoading(true);
    try {
      let resposta;
      let sucesso;

      if (idAnimal) {
        resposta = await apiRequisicaoAnimal.alterarAnimal(
          idAnimal,
          nome,
          idadeNumero,
          raca,
          observacoes,
          idUsuario,
          porteNumero
        );
        sucesso = resposta === true;
      } else {
        resposta = await apiRequisicaoAnimal.inserirAnimal(
          nome,
          idadeNumero,
          raca,
          observacoes,
          idUsuario,
          porteNumero
        );
        sucesso = resposta === true;
      }

      if (sucesso) {
        if (foto && idAnimal) {
          const uploadSucesso = await enviarFotoDetalhadamente(idAnimal);
          if (!uploadSucesso) {
            Toast.show({
              type: "warning",
              text1: "Pet salvo, mas houve erro ao enviar a imagem.",
            });
          }
        }
        Toast.show({
          type: "success",
          text1: idAnimal
            ? "Pet alterado com sucesso!"
            : "Pet inserido com sucesso!",
        });
        resetarFormulario();
        await carregarDados();
      } else {
        Toast.show({ type: "error", text1: "Falha ao salvar pet." });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao salvar pet.",
        text2: error?.message || "",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetarFormulario = () => {
    setIdAnimal("");
    setNome("");
    setIdade("");
    setRaca("");
    setIdPorte("");
    setObservacoes("");
    setFoto(null);
  };

  const excluirPet = (idAnimalParam) => {
    Toast.show({
      type: "info",
      text1: "Função de exclusão de pet não implementada nesta versão.",
    });
  };

  const editarPet = (pet) => {
    setIdAnimal(pet.idAnimal);
    setNome(pet.nome);
    setIdade(pet.idade);
    setRaca(pet.raca);
    setIdPorte(pet.idPorte || "");
    setObservacoes(pet.observacoes);
    setFoto(pet.imagem || null);
  };
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Dados dos Pets</Text>
      </View>
      {loading ? <ActivityIndicator size="large" color="#007aff" /> : null}
      {!loading && (
        <KeyboardAwareScrollView
          style={styles.bodyContainer}
          contentContainerStyle={{ paddingBottom: 20 }}
          keyboardShouldPersistTaps="handled"
          enableOnAndroid
        >
          <TouchableOpacity
            style={styles.fotoContainer}
            onPress={selecionarFoto}
          >
            <ExpoImageWithPlaceholder
              source={foto ? { uri: foto } : undefined}
              style={styles.foto}
            />
            <Text style={styles.textoFoto}>Selecionar Foto</Text>
          </TouchableOpacity>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Nome do Pet</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Digite o nome"
            />
          </View>

          {/*       <View style={styles.inputContainer}>
                        <Text style={styles.label}>Idade</Text>
                        <TextInput
                            style={styles.input}
                            value={idade}
                            onChangeText={setIdade}
                            placeholder="Digite a idade"
                            keyboardType="numeric"
                        />
                    </View>
            */}

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Porte</Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
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
                    idPorte == opcao.value ? styles.porteButtonSelected : null,
                  ]}
                  onPress={() => setIdPorte(opcao.value)}
                >
                  <Text
                    style={[
                      styles.porteButtonText,
                      idPorte == opcao.value
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
            <Text style={styles.label}>Raça</Text>
            <TextInput
              style={styles.input}
              value={raca}
              onChangeText={setRaca}
              placeholder="Digite a raça"
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Observações</Text>
            <TextInput
              style={[styles.input, { height: 80 }]}
              value={observacoes}
              onChangeText={setObservacoes}
              placeholder="Informações adicionais"
              multiline
            />
          </View>

          <TouchableOpacity onPress={salvarPet} style={styles.button}>
            <Text style={styles.buttonText}>
              {idAnimal ? "Alterar" : "Adicionar"}
            </Text>
          </TouchableOpacity>

          <Text style={[styles.titleList, { marginTop: 15 }]}>
            Pets Cadastrados
          </Text>
          {listaDePets.length === 0 ? (
            <Text style={styles.noPetsText}>Nenhum pet cadastrado.</Text>
          ) : (
            listaDePets.map((pet) => (
              <View key={pet.idAnimal} style={styles.petItem}>
                <ExpoImageWithPlaceholder
                  source={{ uri: pet.imagem }}
                  style={styles.petImage}
                />
                <View style={styles.petDetails}>
                  <Text style={styles.petText}>Nome: {pet.nome}</Text>
                  {/*<Text style={styles.petText}>Idade: {pet.idade}</Text>*/}
                  <Text style={styles.petText}>Raça: {pet.raca}</Text>
                  <Text style={styles.petText}>
                    Porte:{" "}
                    {pet.idPorte === 1
                      ? "Pequeno"
                      : pet.idPorte === 2
                      ? "Médio"
                      : pet.idPorte === 3
                      ? "Grande"
                      : "-"}
                  </Text>
                  <Text style={styles.petText}>Obs: {pet.observacoes}</Text>
                </View>
                <View style={styles.actions}>
                  <TouchableOpacity onPress={() => editarPet(pet)}>
                    <Ionicons
                      name="create-outline"
                      size={24}
                      color={colors.secondary}
                    />
                  </TouchableOpacity>
                  {/*
                  <TouchableOpacity onPress={() => excluirPet(pet.idAnimal)} style={{ marginTop: 10 }}>
                    <Ionicons name="trash-outline" size={24} color="#ff4d4d" />
                  </TouchableOpacity>
                  */}
                </View>
              </View>
            ))
          )}
        </KeyboardAwareScrollView>
      )}
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
  titleList: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
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
    padding: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
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
  button: {
    backgroundColor: colors.primary,
    padding: spacing.md,
    borderRadius: radii.md,
    alignItems: "center",
    marginTop: spacing.sm,
  },
  buttonText: {
    color: colors.background,
    fontWeight: "bold",
    fontSize: fontSizes.medium,
  },
  noPetsText: {
    textAlign: "center",
    color: colors.textSecondary,
    marginTop: spacing.md,
  },
  petItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cardBackground || "#fff",
    borderRadius: radii.md,
    padding: spacing.md,
    marginBottom: spacing.md,
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: radii.full,
    marginRight: spacing.md,
  },
  petDetails: {
    flex: 1,
  },
  petText: {
    fontSize: fontSizes.small,
    color: colors.textPrimary,
  },
  actions: {
    justifyContent: "center",
    alignItems: "center",
  },
  porteButton: {
    flex: 1,
    marginHorizontal: 4,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
    alignItems: "center",
  },
  porteButtonSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  porteButtonText: {
    color: "#555",
    fontWeight: "600",
  },
  porteButtonTextSelected: {
    color: "#fff",
  },
});

export default DadosPets;
