import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import apiRequisicaoEmpresa from "../Service/apiRequisicaoEmpresa.js";
import { setEmpresaStore } from "../store/store.js";
import { getUsuarioStore } from "../store/store.js";
import ExpoImageWithPlaceholder from "../components/ExpoImageWithPlaceholder";

const placeholderImg = require("../../assets/placeholder.png");

const TelaInicial = () => {
  const navigation = useNavigation();
  const [empresas, setEmpresas] = useState([]);
  const [loading, setLoading] = useState(true);
  // const [listaLogos, setListaLogos] = useState([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState(1);
  const [erroImagemPromocao, setErroImagemPromocao] = useState({});
  const [erroImagemLogo, setErroImagemLogo] = useState({});

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

  const promocoes = [
    {
      id: 1,
      titulo: "Banho + Tosa por R$ 50",
      descricao: "Promoção válida até domingo!",
      imagem: require("../../assets/icon.png"),
    },
    {
      id: 2,
      titulo: "Veterinário com 50% off",
      descricao: "Somente na primeira consulta",
      imagem: require("../../assets/icon.png"),
    },
  ];

  const irParaAgendamento = (idPetShop) => {
    const empresaSelecionada = empresas.find((e) => e.idEmpresa === idPetShop);
    setEmpresaStore(empresaSelecionada);
    navigation.navigate("Agendamento", { idEmpresaPetShop: idPetShop });
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      try {
        const usuarioStore = getUsuarioStore();
        const idUsuarioLogado = usuarioStore.id;
        const [empresasResp, logosResp] = await Promise.all([
          apiRequisicaoEmpresa.buscarEmpresasVinculadoAoUsuario(
            idUsuarioLogado,
            categoriaSelecionada
          ),
          // apiRequisicaoEmpresa.buscarLogoEmpresas(),
        ]);

        setEmpresas(empresasResp);
        // setListaLogos(logosResp);
      } catch (error) {
        Toast.show({ type: "error", text1: "Erro ao carregar dados." });
      } finally {
        setLoading(false);
      }
    };

    carregarDados();
  }, [categoriaSelecionada]);

  // Renderiza o header com categorias e promoções
  const renderHeader = () => (
    <View>
      <Text style={estilos.tituloSecao}>Categorias</Text>
      <FlatList
        data={categorias}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={estilos.listaCategorias}
        renderItem={({ item }) => {
          const selecionada = categoriaSelecionada === item.id;
          return (
            <TouchableOpacity
              style={[
                estilos.itemCategoria,
                selecionada && estilos.itemCategoriaSelecionada,
              ]}
              onPress={() => setCategoriaSelecionada(item.id)}
            >
              <ExpoImageWithPlaceholder
                source={item.icone}
                style={estilos.iconeCategoria}
              />
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

      {/*<Text style={estilos.tituloSecao}>Promoções</Text>
      <FlatList
        data={promocoes}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingLeft: 16, paddingBottom: 10 }}
        renderItem={({ item }) => (
          <View style={estilos.cartaoPromocao}>
            <ExpoImageWithPlaceholder
              source={
                erroImagemPromocao[item.id] ? placeholderImg : item.imagem
              }
              style={estilos.imagemPromocao}
              onError={() =>
                setErroImagemPromocao((prev) => ({ ...prev, [item.id]: true }))
              }
            />
            <View style={estilos.infoPromocao}>
              <Text style={estilos.tituloPromocao}>{item.titulo}</Text>
              <Text style={estilos.descricaoPromocao}>{item.descricao}</Text>
            </View>
          </View>
        )}
      /> */}

      <Text style={estilos.tituloSecao}>
        {categorias.find((cat) => cat.id === categoriaSelecionada)?.nome ??
          "Empresas"}
      </Text>
    </View>
  );

  return (
    <View style={estilos.container}>
      {loading ? (
        <View style={estilos.overlay}>
          <ActivityIndicator size="large" color="#28A745" />
        </View>
      ) : (
        <FlatList
          data={empresas.filter(
            (item) =>
              !categoriaSelecionada || item.idCategoria === categoriaSelecionada
          )}
          keyExtractor={(item) => item.idEmpresa.toString()}
          ListHeaderComponent={renderHeader}
          renderItem={({ item }) => {
            return (
              <TouchableOpacity
                style={estilos.itemEmpresa}
                onPress={() => irParaAgendamento(item.idEmpresa)}
              >
                <ExpoImageWithPlaceholder
                  source={
                    item.urlLogoEmpresa
                      ? { uri: item.urlLogoEmpresa }
                      : placeholderImg
                  }
                  style={estilos.empresaImagem}
                />
                <View style={estilos.empresaInfo}>
                  <Text style={estilos.empresaNome}>
                    {item.descricaoNomeFisica}
                  </Text>
                  <Text style={estilos.empresaSelos}>
                    {item.hipoalergenico && "🧴 Hipoalergênico"}{" "}
                    {item.taxiDog && "🚕 Táxi Dog"}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20 }}>
              Não existem empresas relacionadas
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
    paddingTop: 30,
  },
  tituloSecao: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
    color: "#2C3E50",
    paddingHorizontal: 16,
  },
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
  cartaoPromocao: {
    backgroundColor: "#F0F4FF",
    marginRight: 10,
    borderRadius: 12,
    overflow: "hidden",
    width: 280,
  },
  imagemPromocao: {
    width: "100%",
    height: 120,
  },
  infoPromocao: {
    padding: 10,
  },
  tituloPromocao: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  descricaoPromocao: {
    fontSize: 14,
    color: "#7F8C8D",
    marginTop: 4,
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
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default TelaInicial;
