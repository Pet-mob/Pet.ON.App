import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Switch,
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { Calendar } from "react-native-calendars";
import { getUsuarioStore } from "../store/store";
import apiRequisicaoAgendamento from "../Service/apiRequisicaoAgendamento";
import apiRequisicaoAnimal from "../Service/apiRequisicaoAnimal";
import apiRequisicaoServico from "../Service/apiRequisicaoServico";
import apiRequisicaoEmpresa from "../Service/apiRequisicaoEmpresa";
import { Image as ExpoImage } from "expo-image";
import { getEmpresaStore } from "../store/store";
import Toast from "react-native-toast-message";

const placeholderImg = require("../../assets/placeholder.png");

const Agendamento = ({ navigation, route }) => {
  const [loading, setLoading] = useState(true);
  const [confirmando, setConfirmando] = useState(false);
  const [modalServicosVisible, setModalServicosVisible] = useState(false);

  const { idEmpresaPetShop } = route.params;
  const { id: idUsuario } = getUsuarioStore();

  const [servicos, setServicos] = useState([]);
  const [pets, setPets] = useState([]);
  const [petSelecionado, setPetSelecionado] = useState(null);
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [ehPacoteMensal, setEhPacoteMensal] = useState(false);
  const [servicosSelecionados, setServicosSelecionados] = useState([]);
  const [parametrosEmpresa, setParametrosEmpresa] = useState({
    modeloTrabalho: 1,
    qtdeAtendimentoSimultaneoHorario: 1,
  });

  const [datasSelecionadas, setDatasSelecionadas] = useState({});
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const empresa = getEmpresaStore();

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    setLoading(true);
    try {
      const [servicosApi, petsApi] = await Promise.all([
        apiRequisicaoServico.buscarServicosEmpresaNaApi(idEmpresaPetShop),
        apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(idUsuario),
      ]);

      if (servicosApi) setServicos(servicosApi);

      // Buscar parâmetros da empresa (mock ou ajuste conforme sua API)
      const parametros = (await apiRequisicaoEmpresa.buscarParametrosEmpresa?.(
        idEmpresaPetShop
      )) || { modeloTrabalho: 1, qtdeAtendimentoSimultaneoHorario: 1 };
      setParametrosEmpresa(parametros);

      // Carregar fotos dos pets
      await manipularFotoAnimal(petsApi);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar serviços ou pets.",
      });
    } finally {
      setLoading(false);
    }

    async function manipularFotoAnimal(petsApi) {
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
      setPets(petsComFoto);
      if (petsComFoto.length === 1) {
        setPetSelecionado(petsComFoto[0].idAnimal);
      }
    }
  };

  const selecionarData = async (dateString) => {
    if (!servicoSelecionado) {
      Toast.show({
        type: "error",
        text1: "Selecione um serviço antes de escolher a data.",
      });
      return;
    }

    const hoje = new Date().toISOString().split("T")[0];
    if (dateString < hoje) {
      Toast.show({
        type: "warning",
        text1: "Não é possível selecionar uma data anterior a hoje.",
      });
      return;
    }

    if (ehPacoteMensal) {
      if (datasSelecionadas[dateString]) {
        const atualizadas = { ...datasSelecionadas };
        delete atualizadas[dateString];
        setDatasSelecionadas(atualizadas);
        // Aguarda atualização do estado antes de buscar horários
        setTimeout(() => buscarHorarios(Object.keys(atualizadas)), 0);
        return;
      }

      const datas = Object.keys(datasSelecionadas);
      if (datas.length >= 4) {
        Toast.show({
          type: "warning",
          text1: "Máximo de 4 datas para plano mensal.",
        });
        return;
      }

      const conflito = datas.some((data) => {
        const diff = Math.abs(
          (new Date(dateString) - new Date(data)) / (1000 * 60 * 60 * 24)
        );
        return diff < 7;
      });

      if (conflito) {
        Toast.show({
          type: "warning",
          text1: "Datas devem ter pelo menos 7 dias de diferença.",
        });
        return;
      }

      const novasDatas = {
        ...datasSelecionadas,
        [dateString]: {
          selected: true,
          marked: true,
          selectedColor: "#81b0ff",
        },
      };
      setDatasSelecionadas(novasDatas);
      setTimeout(() => buscarHorarios(Object.keys(novasDatas)), 0);
    } else {
      const novaData = {
        [dateString]: {
          selected: true,
          marked: true,
          selectedColor: "#81b0ff",
        },
      };
      setDatasSelecionadas(novaData);
      setTimeout(() => buscarHorarios([dateString]), 0);
    }
  };

  const buscarHorarios = async (datas) => {
    // Normaliza datas para garantir que sejam strings no formato YYYY-MM-DD
    const datasFormatadas = datas.map((d) => {
      if (typeof d === "string") return d;
      if (d.year && d.month && d.day) {
        const mm = String(d.month).padStart(2, "0");
        const dd = String(d.day).padStart(2, "0");
        return `${d.year}-${mm}-${dd}`;
      }
      return d;
    });

    if (!servicoSelecionado) {
      setHorariosDisponiveis([]);
      setHorariosSelecionados([]);
      return;
    }
    const servico = servicos.find((s) => s.idServico === servicoSelecionado);
    const duracaoEmMinutos = servico?.duracao || 120;
    setLoading(true);
    try {
      const { horarios } =
        await apiRequisicaoAgendamento.buscarHorariosDisponiveisNaApi(
          idEmpresaPetShop,
          datasFormatadas,
          duracaoEmMinutos
        );
      setHorariosDisponiveis(horarios || []);
      setHorariosSelecionados([]);
    } catch {
      Toast.show({ type: "error", text1: "Erro ao buscar horários." });
    } finally {
      setLoading(false);
    }
  };

  const confirmarAgendamento = async () => {
    if (confirmando) return;
    if (
      !petSelecionado ||
      !servicoSelecionado ||
      horariosSelecionados.length === 0 ||
      Object.keys(datasSelecionadas).length === 0
    ) {
      Toast.show({
        type: "warning",
        text1: "Preencha todos os campos antes de confirmar o agendamento.",
      });
      return;
    }

    setConfirmando(true);
    try {
      const servico = servicos.find((s) => s.idServico === servicoSelecionado);
      const duracao = servico?.duracao || 120;

      const agendamentos = Object.keys(datasSelecionadas).flatMap((data) => {
        return horariosSelecionados.map((horario) => {
          const [h, m] = horario.split(":");
          const inicio = new Date(`${data}T${h}:${m}:00`);
          const fim = new Date(inicio);
          fim.setMinutes(fim.getMinutes() + duracao);

          return {
            idServico: servicoSelecionado,
            idAnimal: petSelecionado,
            idUsuario,
            idEmpresa: idEmpresaPetShop,
            pacoteMensal: ehPacoteMensal,
            listaDatasAgendamento: [inicio.toISOString()],
            horario: `${horario}:00`,
            horarioFinal: `${fim.getHours().toString().padStart(2, "0")}:${fim
              .getMinutes()
              .toString()
              .padStart(2, "0")}:00`,
            status: "Agendado",
          };
        });
      });

      for (const dto of agendamentos) {
        await apiRequisicaoAgendamento.adicionarAgendamentoNaApi(dto);
      }

      Toast.show({
        type: "success",
        text1: "Agendamento realizado com sucesso!",
        text2: "Este é um toast customizado!",
      });
      navigation.goBack();
    } catch {
      Toast.show({ type: "error", text1: "Erro ao confirmar agendamento." });
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <FlatList
          style={styles.scrollContainer}
          ListHeaderComponent={
            <>
              {/* 1 - Capa */}
              <ExpoImage
                source={require("../../assets/LogoGrande.png")}
                style={styles.capa}
                placeholder={placeholderImg}
                contentFit="cover"
                transition={300}
              />

              {/* 2 - Dados da empresa */}
              <View style={styles.infoBox}>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    minHeight: 60,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    style={{ marginRight: 8, padding: 4 }}
                  >
                    <Icon
                      name="chevron-back-outline"
                      size={28}
                      color="#007aff"
                    />
                  </TouchableOpacity>
                  <ExpoImage
                    source={
                      empresa?.urlLogoEmpresa
                        ? { uri: empresa.urlLogoEmpresa }
                        : placeholderImg
                    }
                    style={styles.logoEmpresa}
                    placeholder={placeholderImg}
                    contentFit="cover"
                    transition={300}
                  />
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.nomeEmpresa} numberOfLines={1}>
                      {empresa?.descricaoNomeFisica || "nome da empresa"}
                    </Text>
                    <Text style={styles.detalhesLoja} numberOfLines={1}>
                      Endereço da empresa aqui
                    </Text>
                  </View>
                </View>
              </View>

              {/* 3 - Selecionar pet */}
              <Text style={styles.label}>Escolha o pet:</Text>
              <FlatList
                data={pets}
                keyExtractor={(item) => String(item.idAnimal)}
                horizontal
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={[
                      styles.petBox,
                      petSelecionado === item.idAnimal && styles.petSelecionado,
                    ]}
                    onPress={() => setPetSelecionado(item.idAnimal)}
                  >
                    <ExpoImage
                      source={
                        typeof item.imagem === "string"
                          ? { uri: item.imagem }
                          : item.imagem
                      }
                      style={styles.petImage}
                      placeholder={placeholderImg}
                      contentFit="cover"
                      transition={300}
                    />
                    <Text style={styles.petName}>{item.nome}</Text>
                  </TouchableOpacity>
                )}
              />

              {/* 4 - Botão para abrir modal de serviços */}
              <TouchableOpacity
                style={styles.btnConfirmar}
                onPress={() => setModalServicosVisible(true)}
              >
                <Text style={styles.textBtnConfirmar}>Selecionar Serviços</Text>
              </TouchableOpacity>

              {/* 5 - Resumo dos serviços */}
              <Text style={styles.label}>Resumo dos Serviços:</Text>
              {servicos
                .filter((s) => servicosSelecionados.includes(s.idServico))
                .map((s) => (
                  <View
                    key={s.idServico}
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginBottom: 4,
                    }}
                  >
                    <Text>{s.descricao}</Text>
                    <Text>R$ {s.valor}</Text>
                  </View>
                ))}
              <Text
                style={{
                  fontWeight: "bold",
                  fontSize: 16,
                  marginBottom: 10,
                }}
              >
                Total: R${" "}
                {servicos
                  .filter((s) => servicosSelecionados.includes(s.idServico))
                  .reduce((acc, s) => acc + Number(s.valor), 0)
                  .toFixed(2)}
              </Text>
              {/* 6 - Data modo calendário */}
              <Text style={styles.label}>Selecione data:</Text>
              <Calendar
                markedDates={datasSelecionadas}
                onDayPress={selecionarData}
                minDate={new Date().toISOString().split("T")[0]}
              />
              {/* 7 - Lista dos horários disponíveis */}
              {horariosDisponiveis.length > 0 && (
                <View>
                  <Text style={styles.label}>Horários disponíveis:</Text>
                  <FlatList
                    data={horariosDisponiveis}
                    keyExtractor={(item) => item}
                    horizontal
                    renderItem={({ item }) => (
                      <TouchableOpacity
                        style={[
                          styles.horarioBox,
                          horariosSelecionados.includes(item) &&
                            styles.horarioSelecionado,
                        ]}
                        onPress={() => {
                          if (horariosSelecionados.includes(item)) {
                            setHorariosSelecionados([]);
                          } else {
                            setHorariosSelecionados([item]);
                          }
                        }}
                      >
                        <Text
                          style={{
                            color: horariosSelecionados.includes(item)
                              ? "#fff"
                              : "#000",
                          }}
                        >
                          {item}
                        </Text>
                      </TouchableOpacity>
                    )}
                  />
                </View>
              )}
              {/* 8 - Complementares */}
              <View style={styles.switchContainer}>
                <Text style={styles.label}>Tipo do agendamento:</Text>
                <Text>{ehPacoteMensal ? "Plano mensal" : "Único"}</Text>
                <Switch
                  value={ehPacoteMensal}
                  onValueChange={() => {
                    setEhPacoteMensal((v) => !v);
                    setDatasSelecionadas({});
                    setHorariosSelecionados([]);
                  }}
                  trackColor={{ false: "#767577", true: "#81b0ff" }}
                  thumbColor={ehPacoteMensal ? "#007aff" : "#f4f3f4"}
                />
              </View>
              {/* 9 - Botão de confirmação */}
              <TouchableOpacity
                style={styles.btnConfirmar}
                onPress={confirmarAgendamento}
                disabled={confirmando}
              >
                <Text style={styles.textBtnConfirmar}>
                  {confirmando ? "Confirmando..." : "Confirmar Agendamento"}
                </Text>
              </TouchableOpacity>
            </>
          }
        />
      )}

      {/* Modal para seleção de serviços - ESTILO DO PRINT */}
      <Modal
        visible={modalServicosVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalServicosVisible(false)}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.15)",
          }}
        >
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitlePrint}>Selecione os serviços:</Text>
            <FlatList
              data={servicos}
              keyExtractor={(item) => String(item.idServico)}
              renderItem={({ item }) => {
                const selecionado = servicosSelecionados.includes(
                  item.idServico
                );
                return (
                  <View style={styles.servicoLinhaPrint}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.servicoNomePrint}>
                        {item.descricao}
                      </Text>
                      <Text style={styles.servicoValorPrint}>
                        R$ {item.valor}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.btnAddRemovePrint}
                      onPress={() => {
                        if (selecionado) {
                          setServicosSelecionados(
                            servicosSelecionados.filter(
                              (id) => id !== item.idServico
                            )
                          );
                        } else {
                          setServicosSelecionados([
                            ...servicosSelecionados,
                            item.idServico,
                          ]);
                        }
                      }}
                    >
                      <Icon
                        name={selecionado ? "remove" : "add"}
                        size={22}
                        color={selecionado ? "#d32f2f" : "#888"}
                        style={{
                          borderWidth: 1,
                          borderColor: "#ccc",
                          borderRadius: 12,
                          padding: 2,
                          backgroundColor: "#fff",
                        }}
                      />
                    </TouchableOpacity>
                  </View>
                );
              }}
              ListEmptyComponent={
                <Text style={{ color: "#888", margin: 16 }}>
                  Nenhum serviço disponível
                </Text>
              }
            />
            <TouchableOpacity
              style={styles.btnAdicionarPrint}
              onPress={() => setModalServicosVisible(false)}
            >
              <Text style={styles.textBtnAdicionarPrint}>Adicionar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    paddingTop: 50,
    alignItems: "center",
    // justifyContent: "center",
    // padding: 15,
    // elevation: 9,
    // position: "relative",
    // borderBottomWidth: 1
  },
  // botaoVoltar: {
  //     paddingTop: 50,
  //     padding: 15,
  //     position: "absolute",
  //     left: 1,
  // },

  // header: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 20, fontWeight: "bold", marginLeft: 10 },
  scrollContainer: { marginBottom: 20 },
  switchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  label: { fontSize: 16, fontWeight: "600", marginVertical: 10 },
  itemBox: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemSelected: { backgroundColor: "#cce4ff", borderColor: "#007aff" },
  horarioBox: {
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  horarioSelecionado: {
    backgroundColor: "#007aff",
    borderColor: "#005bb5",
  },
  petBox: {
    alignItems: "center",
    marginRight: 15,
  },
  petSelecionado: {
    borderWidth: 2,
    borderColor: "#007aff",
    borderRadius: 50,
    padding: 2,
  },
  petImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  petName: {
    marginTop: 5,
    fontSize: 14,
    maxWidth: 70,
    textAlign: "center",
  },
  btnConfirmar: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
  },
  textBtnConfirmar: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  headerDadosEmpresa: {
    marginBottom: 20,
    backgroundColor: "#007aff",
    position: "relative",
  },
  capa: {
    width: "100%",
    height: 160,
  },
  infoBox: {
    backgroundColor: "#fff",
    marginHorizontal: 10,
    borderRadius: 16,
    padding: 18,
    marginTop: -50,
    elevation: 12, // Sombra forte no Android
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  logoEmpresa: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: "#007aff",
    backgroundColor: "#fff",
  },
  textosEmpresa: {
    marginLeft: 0,
  },
  nomeEmpresa: {
    fontSize: 18,
    fontWeight: "bold",
  },
  detalhesLoja: {
    fontSize: 14,
    color: "#777",
    marginTop: 2,
  },
  linhaInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  avaliacao: {
    fontSize: 14,
    marginRight: 10,
  },
  cinza: {
    color: "#777",
  },
  nivel: {
    fontSize: 14,
    color: "#777",
  },
  entrega: {
    marginTop: 5,
    fontSize: 14,
  },
  // ...existing code...
  // --- Modal estilo print ---
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 0,
    minHeight: "80%",
    maxHeight: "90%",
  },
  modalTitlePrint: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 18,
    marginLeft: 2,
  },
  servicoLinhaPrint: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
    paddingHorizontal: 2,
    minHeight: 44,
  },
  servicoNomePrint: {
    fontSize: 16,
    color: "#222",
    marginBottom: 2,
  },
  servicoValorPrint: {
    fontSize: 14,
    color: "#888",
    marginBottom: 0,
  },
  btnAddRemovePrint: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#fff",
  },
  btnAdicionarPrint: {
    backgroundColor: "#d32f2f",
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 0,
    marginTop: 24,
    marginBottom: 18,
  },
  textBtnAdicionarPrint: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default Agendamento;
