import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import apiRequisicaoEmpresa from "../Service/apiRequisicaoEmpresa";
import { useNavigation } from "@react-navigation/native";
import { setEmpresaStore } from "../store/store";
import { getUsuarioStore } from "../store/store";

const categorias = [
  { id: 1, nome: "Pet shop", icone: require("../../assets/PetShop.png") },
  {
    id: 2,
    nome: "Veterinário",
    icone: require("../../assets/Veterinario.png"),
  },
  { id: 3, nome: "Hotel", icone: require("../../assets/HotelPet.png") },
  { id: 4, nome: "Creche", icone: require("../../assets/Creche.png") },
];

const filtrosExtra = [
  { id: "aberto", nome: "Aberto agora" },
  { id: "promocao", nome: "Com promoções" },
];

const Buscar = () => {
  const navigation = useNavigation();
  const [empresas, setEmpresas] = useState([]);
  const [listaLogos, setListaLogos] = useState([]);
  const [busca, setBusca] = useState("");
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(null);
  const [filtrosAtivos, setFiltrosAtivos] = useState([]);
  const [loading, setLoading] = useState(true);

  const usuario = getUsuarioStore();

  const carregarEmpresas = async () => {
    setLoading(true);
    try {
      const responseEmpresas =
        await apiRequisicaoEmpresa.buscarEmpresasVinculadoAoUsuario(
          usuario.id,
          categoriaSelecionada
        );

      const responseLogos = await apiRequisicaoEmpresa.buscarLogosEmpresas();
      setEmpresas(responseEmpresas);
      setListaLogos(responseLogos);
    } catch (err) {
      console.log("Erro:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarEmpresas();
  }, [categoriaSelecionada]);

  const toggleFiltro = (filtroId) => {
    setFiltrosAtivos((prev) =>
      prev.includes(filtroId)
        ? prev.filter((f) => f !== filtroId)
        : [...prev, filtroId]
    );
  };

  const irParaAgendamento = (idEmpresa) => {
    const empresaSelecionada = empresas.find((e) => e.idEmpresa === idEmpresa);
    setEmpresaStore(empresaSelecionada);
    navigation.navigate("Agendamento", { idEmpresaPetShop: idEmpresa });
  };

  const empresasFiltradas = empresas
    .filter((empresa) =>
      empresa.descricaoNomeFisica.toLowerCase().includes(busca.toLowerCase())
    )
    .filter((empresa) => {
      if (filtrosAtivos.includes("promocao") && !empresa.temPromocao) {
        return false;
      }
      if (filtrosAtivos.includes("aberto") && !empresa.abertoAgora) {
        return false;
      }
      return true;
    });

  return (
    <View style={estilos.container}>
      <TextInput
        placeholder="Buscar por nome..."
        value={busca}
        onChangeText={setBusca}
        style={estilos.inputBuscar}
      />

      <FlatList
        data={categorias}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={estilos.listaCategorias}
        renderItem={({ item }) => {
          const selecionada = item.id === categoriaSelecionada;
          return (
            <TouchableOpacity
              onPress={() =>
                setCategoriaSelecionada(selecionada ? null : item.id)
              }
              style={[
                estilos.itemCategoria,
                selecionada && estilos.itemCategoriaSelecionada,
              ]}
            >
              <Image source={item.icone} style={estilos.iconeCategoria} />
              <Text
                style={[
                  estilos.textoCategoria,
                  selecionada && estilos.textoCategoriaSelecionada,
                ]}
              >
                {item.nome}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      <FlatList
        data={filtrosExtra}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={estilos.filtrosContainer}
        renderItem={({ item }) => {
          const ativo = filtrosAtivos.includes(item.id);
          return (
            <TouchableOpacity
              onPress={() => toggleFiltro(item.id)}
              style={[estilos.filtroBadge, ativo && estilos.filtroBadgeAtivo]}
            >
              <Text style={{ color: ativo ? "#fff" : "#00796B" }}>
                {item.nome}
              </Text>
            </TouchableOpacity>
          );
        }}
      />

      {loading ? (
        <ActivityIndicator size="large" color="#28A745" />
      ) : (
        <FlatList
          data={empresasFiltradas}
          keyExtractor={(item) => item.idEmpresa.toString()}
          renderItem={({ item }) => {
            const logo = listaLogos.find((l) => l.idEmpresa === item.idEmpresa);
            const imagem = logo?.url
              ? { uri: logo.url }
              : require("../../assets/usuario.png");

            return (
              <TouchableOpacity
                onPress={() => irParaAgendamento(item.idEmpresa)}
              >
                <View style={estilos.itemEmpresa}>
                  <Image source={imagem} style={estilos.iconeEmpresa} />
                  <Text style={estilos.nomeEmpresa}>
                    {item.descricaoNomeFisica}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Nenhuma empresa encontrada
            </Text>
          }
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 40,
    paddingHorizontal: 16,
  },
  inputBuscar: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 10,
  },
  listaCategorias: {
    marginBottom: 10,
  },
  itemCategoria: {
    backgroundColor: "#E0F7FA",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    marginRight: 12,
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
    marginBottom: 10,
  },
  filtroBadge: {
    backgroundColor: "#E0F2F1",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginRight: 10,
  },
  filtroBadgeAtivo: {
    backgroundColor: "#00796B",
  },
  itemEmpresa: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  iconeEmpresa: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  nomeEmpresa: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
});

export default Buscar;
