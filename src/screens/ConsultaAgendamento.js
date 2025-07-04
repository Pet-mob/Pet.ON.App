import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import ExpoImageWithPlaceholder from "../components/ExpoImageWithPlaceholder";
import { format } from "date-fns";
import { Ionicons } from "@expo/vector-icons";
import apiRequisicaoAgendamento from "../Service/apiRequisicaoAgendamento.js";
import { getUsuarioStore } from "../store/store";

const ConsultaAgendamento = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const usuarioStore = getUsuarioStore();
  const idUsuario = usuarioStore.id;
  const [consultaAgendamentos, setConsultaAgendamentos] = useState([]);

  const buscarAgendamentosPorUsuario = async (idUsuario) => {
    try {
      const resposta =
        await apiRequisicaoAgendamento.buscarAgendamentosPorUsuario(idUsuario);
      if (resposta) {
        setConsultaAgendamentos(resposta);
      } else {
        Toast.show({ type: "info", text1: "Não há dados cadastrados." });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar dados dos agendamentos",
      });
    }
  };

  const formatarData = (dataParametro) => {
    return format(new Date(dataParametro), "dd/MM/yyyy");
  };

  const formatarHorario = (horarioParametro) => {
    return horarioParametro.slice(0, 5);
  };

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      await buscarAgendamentosPorUsuario(idUsuario);
      setLoading(false);
    };

    carregarDados();
  }, []);

  // Replicar último agendamento
  const replicarUltimoAgendamento = () => {
    if (!consultaAgendamentos.length) return;
    const ultimo = consultaAgendamentos[0];
    navigation.navigate("Agendamento", {
      idEmpresaPetShop: ultimo.idEmpresa,
      replicar: true,
      dadosAgendamento: ultimo,
    });
  };

  return (
    <View style={estilos.container}>
      {/* Cabeçalho */}
      <View style={estilos.cabecalho}>
        <TouchableOpacity
          style={estilos.botaoVoltar}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={estilos.titulo}>Meus agendamentos</Text>
      </View>

      {/* Botão de replicar último agendamento (invisível nesta versão) */}
      {/*
      {consultaAgendamentos.length > 0 && (
        <TouchableOpacity
          style={estilos.botaoReplicar}
          onPress={replicarUltimoAgendamento}
        >
          <Text style={estilos.textoBotaoReplicar}>
            Replicar último agendamento
          </Text>
        </TouchableOpacity>
      )}
      */}

      {/* Loading Spinner */}
      {loading ? (
        <View style={estilos.loadingContainer}>
          <Text style={estilos.loadingText}>Carregando agendamentos...</Text>
        </View>
      ) : (
        <FlatList
          data={consultaAgendamentos}
          keyExtractor={(item) => item.idAgendamento.toString()}
          renderItem={({ item }) => (
            <View style={estilos.agendamentoLinha}>
              <ExpoImageWithPlaceholder
                source={{ uri: item.urlFotoAnimal }}
                style={estilos.imagemPet}
              />
              <View style={{ flex: 1 }}>
                <Text style={estilos.textoAgendamentoNegrito}>
                  🐶 {item.nomeAnimal}
                </Text>
                <Text style={estilos.textoAgendamento}>
                  ✂️ Serviço: {item.descricaoServico}
                </Text>
                <Text style={estilos.textoAgendamento}>
                  🏢 Estabelecimento: {item.nomeEmpresa}
                </Text>
                <Text style={estilos.textoAgendamento}>
                  📅 Data: {formatarData(item.data)}
                </Text>
                <Text style={estilos.textoAgendamento}>
                  ⏰ Horário: {formatarHorario(item.horarioInicial)} -{" "}
                  {formatarHorario(item.horarioFinal)}
                </Text>

                {/* Badge de status (ex: Confirmado/Pendente) - opcional */}
                {item.status && (
                  <View
                    style={[
                      estilos.badgeStatus,
                      item.status === "Concluído"
                        ? estilos.statusConfirmado
                        : item.status === "Agendado"
                        ? estilos.statusPendente
                        : estilos.statusCancelado,
                    ]}
                  >
                    <Text style={estilos.badgeTexto}>{item.status}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
          ListEmptyComponent={
            <Text style={estilos.textoVazio}>
              Nenhum agendamento encontrado.
            </Text>
          }
        />
      )}
    </View>
  );
};

const estilos = StyleSheet.create({
  badgeStatus: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusConfirmado: {
    backgroundColor: "#10B981",
  },
  statusPendente: {
    backgroundColor: "#F59E0B",
  },
  statusCancelado: {
    backgroundColor: "#EF4444",
  },
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  cabecalho: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  botaoVoltar: {
    position: "absolute",
    left: 16,
    top: 50,
    // padding: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  agendamentoLinha: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center",
  },
  imagemPet: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  textoAgendamento: {
    fontSize: 14,
    color: "#374151",
  },
  textoAgendamentoNegrito: {
    fontSize: 15,
    color: "#1F2937",
    fontWeight: "bold",
  },
  textoVazio: {
    textAlign: "center",
    fontSize: 16,
    marginTop: 20,
    color: "#6B7280",
  },
  badgeStatus: {
    marginTop: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeTexto: {
    color: "#FFF",
    fontSize: 12,
    fontWeight: "bold",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    fontSize: 16,
    color: "#4F46E5",
    fontWeight: "bold",
    marginTop: 20,
  },
  botaoReplicar: {
    backgroundColor: "#4F46E5",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 0,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
  },
  textoBotaoReplicar: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 15,
  },
});

export default ConsultaAgendamento;
