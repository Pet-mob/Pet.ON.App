import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const Buscar = ({ navigation, route }) => {
  const [busca, setBusca] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState(null);
  const [modalOrdenacaoVisible, setModalOrdenacaoVisible] = useState(false);

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

  const empresas = [
    {
      nome: "Pet Feliz",
      categoria: "Pet shop",
      nota: 4.9,
      tempo: "30-40 min",
      preco: "R$ 35,00",
      imagem: require("../../assets/PetShop.png"),
    },
    {
      nome: "Clínica Vet Vida",
      categoria: "Veterinário",
      nota: 4.8,
      tempo: "20-30 min",
      preco: "R$ 80,00",
      imagem: require("../../assets/Veterinario.png"),
    },
    {
      nome: "Hotel Bom pra Cachorro",
      categoria: "Hotel",
      nota: 4.7,
      tempo: "50-60 min",
      preco: "R$ 120,00",
      imagem: require("../../assets/HotelPet.png"),
    },
    {
      nome: "Creche Pet Love",
      categoria: "Creche",
      nota: 4.5,
      tempo: "40-50 min",
      preco: "R$ 90,00",
      imagem: require("../../assets/Creche.png"),
    },
  ];

  const empresasFiltradas = empresas.filter((empresa) => {
    const porNome = empresa.nome.toLowerCase().includes(busca.toLowerCase());
    const porCategoria = filtroCategoria
      ? empresa.categoria === filtroCategoria
      : true;
    return porNome && porCategoria;
  });

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
          numColumns={4}
          key={"4-cols"}
          keyExtractor={(item) => item.nome}
          contentContainerStyle={styles.categoriasContainer}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          renderItem={({ item }) => {
            const selecionado = filtroCategoria === item.nome;
            return (
              <TouchableOpacity
                style={[
                  styles.categoriaCard,
                  selecionado && styles.categoriaSelecionada,
                ]}
                onPress={() =>
                  setFiltroCategoria((prev) =>
                    prev === item.nome ? null : item.nome
                  )
                }
              >
                <Image source={item.imagem} style={styles.categoriaImagem} />
                <Text style={styles.categoriaTexto}>{item.nome}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {/* Filtros rápidos */}
      <View style={styles.filtrosContainer}>
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
      </View>

      {/* Lista de empresas */}
      <FlatList
        data={empresasFiltradas}
        keyExtractor={(item) => item.nome}
        renderItem={({ item }) => (
          <View style={styles.empresaCard}>
            <Image source={item.imagem} style={styles.empresaImagem} />
            <View style={styles.empresaInfo}>
              <Text style={styles.empresaNome}>{item.nome}</Text>
              <Text>
                {item.categoria} • {item.tempo} • {item.preco}
              </Text>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: "center", marginTop: 20 }}>
            Nenhuma empresa encontrada.
          </Text>
        }
      />

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
  categoriasContainer: {
    paddingHorizontal: 3,
  },
  categoriaCard: {
    backgroundColor: "#E0F7FA",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    margin: 8,
    flex: 1,
  },
  categoriaSelecionada: {
    backgroundColor: "#26C6DA",
  },
  categoriaImagem: {
    width: 60,
    height: 60,
    marginBottom: 8,
  },
  categoriaTexto: {
    fontSize: 12,
    color: "#00796B",
    textAlign: "center",
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
  empresaCard: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  empresaImagem: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  empresaInfo: {
    flex: 1,
    justifyContent: "center",
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
});

export default Buscar;
