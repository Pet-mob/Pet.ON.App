import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import apiRequisicaoEmpresa from "../Service/apiRequisicaoEmpresa.js";
import { setEmpresaStore } from "../store/store.js";
import ExpoImageWithPlaceholder from "../components/ExpoImageWithPlaceholder";

const placeholderImg = require("../../assets/placeholder.png");

const Buscar = ({ navigation, route }) => {
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(1); // ID 1 selecionado por padrão
  const [filtroCategoria, setFiltroCategoria] = useState("Pet shop"); // Nome sincronizado só para exibição
  const [modalOrdenacaoVisible, setModalOrdenacaoVisible] = useState(false);
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(false);

  const categorias = [
    { id: 1, nome: "Pet shop", imagem: require("../../assets/PetShop.png") },
    {
      id: 2,
      nome: "Veterinário",
      imagem: require("../../assets/Veterinario.png"),
    },
    { id: 3, nome: "Hotel", imagem: require("../../assets/HotelPet.png") },
    { id: 4, nome: "Creche", imagem: require("../../assets/Creche.png") },
  ];

  const handleSelecionarCategoria = async (categoriaId) => {
    const novoValor = categoriaSelecionada === categoriaId ? null : categoriaId;
    setCategoriaSelecionada(novoValor);

    // Aguarde o próximo tick do estado (simulando delay)
    setTimeout(() => {
      carregarEmpresas(novoValor); // chama manualmente a função de carregar com o novo valor
    }, 0);
  };

  // Sincronizar nome da categoria (filtroCategoria) baseado no ID
  useEffect(() => {
    const cat = categorias.find((c) => c.id === categoriaSelecionada);
    setFiltroCategoria(cat?.nome || null);
  }, [categoriaSelecionada]);

  const carregarEmpresas = async (categoriaId) => {
    setLoading(true);
    try {
      const [empresasResp, logosResp] = await Promise.all([
        apiRequisicaoEmpresa.buscarEmpresas(categoriaId),
      ]);

      setEmpresas(empresasResp);
    } catch (error) {
      Toast.show({ type: "error", text1: "Erro ao carregar dados." });
    } finally {
      setLoading(false);
    }
  };
  // Carregar empresas da categoria selecionada
  useEffect(() => {
    carregarEmpresas(categoriaSelecionada);
  }, []);

  const empresasFiltradas = empresas.filter((empresa) =>
    empresa.descricaoNomeFisica?.toLowerCase().includes(busca.toLowerCase())
  );

  const irParaAgendamento = (idPetShop) => {
    const empresaSelecionada = empresas.find((e) => e.idEmpresa === idPetShop);
    setEmpresaStore(empresaSelecionada);
    navigation.navigate("Agendamento", { idEmpresaPetShop: idPetShop });
  };

  return (
    <View style={styles.container}>
      {/* Campo de busca */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" />
        <TextInput
          placeholder="Buscar empresas..."
          style={styles.input}
          value={busca}
          onChangeText={setBusca}
        />
      </View>

      {/* Lista de categorias */}
      <View style={{ flexShrink: 1 }}>
        <FlatList
          data={categorias}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listaCategorias}
          renderItem={({ item }) => {
            const selecionado = categoriaSelecionada === item.id;
            return (
              <TouchableOpacity
                style={[
                  styles.itemCategoria,
                  selecionado && styles.itemCategoriaSelecionada,
                ]}
                onPress={() => handleSelecionarCategoria(item.id)}
              >
                <ExpoImageWithPlaceholder
                  source={item.imagem}
                  style={styles.iconeCategoria}
                />
                <Text
                  style={[
                    styles.textoCategoria,
                    selecionado && styles.textoCategoriaSelecionada,
                  ]}
                >
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Filtros rápidos */}
      {/* <View style={styles.filtrosContainer}>
        <TouchableOpacity
          onPress={() => setModalOrdenacaoVisible(true)}
          style={styles.filtroBotao}
        >
          <Text>Ordenar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtroBotao}>
          <Text>Promoções</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filtroBotao}>
          <Text>Aberto agora</Text>
        </TouchableOpacity>
      </View> */}

      {/* Modal de ordenação */}
      <Modal visible={modalOrdenacaoVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ordenar por</Text>
            <TouchableOpacity onPress={() => setModalOrdenacaoVisible(false)}>
              <Text>Ordenação Padrão</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Preço</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Avaliação</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Tempo de entrega</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text>Distância</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Lista de empresas */}
      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" color="#28A745" />
        </View>
      ) : (
        <FlatList
          data={empresasFiltradas}
          keyExtractor={(item, index) =>
            item.idEmpresa?.toString() || `${item.descricaoNomeFisica}-${index}`
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.itemEmpresa}
              onPress={() => irParaAgendamento(item.idEmpresa)}
            >
              <ExpoImageWithPlaceholder
                source={
                  item.urlLogoEmpresa
                    ? { uri: item.urlLogoEmpresa }
                    : placeholderImg
                }
                style={styles.empresaImagem}
              />
              <View style={styles.empresaInfo}>
                <Text style={styles.empresaNome}>
                  {item.descricaoNomeFisica}
                </Text>
                <Text style={styles.empresaSelos}>
                  {item.hipoalergenico && "🧴 Hipoalergênico"}{" "}
                  {item.taxiDog && "🚕 Táxi Dog"}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Nenhuma empresa encontrada.
            </Text>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 40 },
  searchContainer: {
    flexDirection: "row",
    backgroundColor: "#eee",
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
    alignItems: "center",
  },
  input: { flex: 1, padding: 10 },
  listaCategorias: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  itemCategoria: {
    backgroundColor: "#E0F7FA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 7,
    width: 90,
    height: 80,
  },
  itemCategoriaSelecionada: {
    backgroundColor: "#26C6DA",
  },
  iconeCategoria: {
    width: 36,
    height: 36,
    marginBottom: 4,
    resizeMode: "contain",
  },
  textoCategoria: {
    fontSize: 12,
    color: "#00796B",
    textAlign: "center",
  },
  textoCategoriaSelecionada: {
    color: "#fff",
    fontWeight: "bold",
  },
  filtrosContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    marginVertical: 10,
  },
  filtroBotao: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 20,
  },
  itemEmpresa: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  empresaImagem: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },
  empresaInfo: {
    flex: 1,
    justifyContent: "center",
  },
  empresaSelos: {
    fontSize: 12,
    color: "#555",
    marginTop: 4,
  },
  empresaNome: {
    fontWeight: "bold",
    marginBottom: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 10,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Buscar;
