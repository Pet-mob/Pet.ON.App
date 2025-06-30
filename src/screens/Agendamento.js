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
      const parametros =
        (await apiRequisicaoEmpresa.buscarParametrosEmpresa?.(idEmpresaPetShop)) ||
        { modeloTrabalho: 1, qtdeAtendimentoSimultaneoHorario: 1 };
      setParametrosEmpresa(parametros);

      const capaEmpresa =
        await apiRequisicaoEmpresa.buscarLogoEmpresaPorIdEmpresa(
          idEmpresaPetShop
        );
      // Carregar fotos dos pets
      await manipularFotoAnimal(petsApi);

      const dataHoje = new Date().toISOString().split("T")[0];
      selecionarData(dataHoje);
    } catch (error) {
      Alert.alert("Erro", "Erro ao carregar serviços ou pets.");
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
          imagem: foto?.url || require("../../assets/usuario.png"),
        };
      });
      setPets(petsComFoto);
    }
  };

  const selecionarData = async (dateString) => {
    const hoje = new Date().toISOString().split("T")[0];
    if (dateString < hoje) {
      Alert.alert(
        "Atenção",
        "Não é possível selecionar uma data anterior a hoje."
      );
      return;
    }

    if (ehPacoteMensal) {
      if (datasSelecionadas[dateString]) {
        const atualizadas = { ...datasSelecionadas };
        delete atualizadas[dateString];
        setDatasSelecionadas(atualizadas);
        await buscarHorarios(Object.keys(atualizadas));
        return;
      }

      const datas = Object.keys(datasSelecionadas);
      if (datas.length >= 4) {
        Alert.alert("Atenção", "Máximo de 4 datas para plano mensal.");
        return;
      }

      const conflito = datas.some((data) => {
        const diff = Math.abs(
          (new Date(dateString) - new Date(data)) / (1000 * 60 * 60 * 24)
        );
        return diff < 7;
      });

      if (conflito) {
        Alert.alert(
          "Atenção",
          "Datas devem ter pelo menos 7 dias de diferença."
        );
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
      await buscarHorarios(Object.keys(novasDatas));
    } else {
      const novaData = {
        [dateString]: {
          selected: true,
          marked: true,
          selectedColor: "#81b0ff",
        },
      };
      setDatasSelecionadas(novaData);
      await buscarHorarios([dateString]);
    }
  };

  const buscarHorarios = async (datas) => {
    if (!datas.length) {
      setHorariosDisponiveis([]);
      setHorariosSelecionados([]);
      return;
    }
    const servico = servicos.find((s) => s.idServico === servicoSelecionado);

    const duracao = servico?.duracao || 120;

    setLoading(true);
    try {
      const { horarios } =
        await apiRequisicaoAgendamento.buscarHorariosDisponiveisNaApi(
          idEmpresaPetShop,
          datas,
          duracao
        );
      setHorariosDisponiveis(horarios || []);
      setHorariosSelecionados([]);
    } catch {
      Alert.alert("Erro", "Erro ao buscar horários.");
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
      Alert.alert(
        "Atenção",
        "Preencha todos os campos antes de confirmar o agendamento."
      );
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

      Alert.alert("Sucesso", "Agendamento realizado com sucesso!");
      navigation.goBack();
    } catch {
      Alert.alert("Erro", "Erro ao confirmar agendamento.");
    } finally {
      setConfirmando(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={30} color="#000" />
        </TouchableOpacity>
        <Text style={styles.title}>Agendamento</Text>
      </View> */}

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
                <ExpoImage
                  source={require("../../assets/PetShop.png")}
                  style={styles.logoEmpresa}
                  placeholder={placeholderImg}
                  contentFit="cover"
                  transition={300}
                />

                <View style={styles.textosEmpresa}>
                  <Text style={styles.nomeEmpresa}>
                    Parque Burguer - Burguer Artesanal
                  </Text>
                  <Text style={styles.detalhesLoja}>
                    Endereço da empresa aqui
                  </Text>
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
                        item.imagem?.startsWith("http")
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
              {/* Modal de serviços */}
              <Modal visible={modalServicosVisible} animationType="slide" transparent>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "rgba(0,0,0,0.3)",
                    justifyContent: "center",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "#fff",
                      margin: 20,
                      borderRadius: 10,
                      padding: 20,
                      maxHeight: "80%",
                    }}
                  >
                    <Text style={styles.label}>Selecione os serviços</Text>
                    <ScrollView>
                      {servicos.map((servico) => {
                        const selecionado = servicosSelecionados.includes(
                          servico.idServico
                        );
                        return (
                          <TouchableOpacity
                            key={servico.idServico}
                            style={[
                              styles.itemBox,
                              selecionado && styles.itemSelected,
                            ]}
                            onPress={() => {
                              if (parametrosEmpresa.modeloTrabalho === 1) {
                                setServicosSelecionados([servico.idServico]);
                              } else {
                                setServicosSelecionados((prev) =>
                                  prev.includes(servico.idServico)
                                    ? prev.filter((id) => id !== servico.idServico)
                                    : [...prev, servico.idServico]
                                );
                              }
                            }}
                          >
                            <Text>{servico.descricao}</Text>
                            <Text>R$ {servico.valor}</Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                    <TouchableOpacity
                      style={[styles.btnConfirmar, { marginTop: 10 }]}
                      onPress={() => setModalServicosVisible(false)}
                    >
                      <Text style={styles.textBtnConfirmar}>Avançar</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Modal>
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
                <>
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
                          // Validação de qtde de atendimento simultâneo
                          const count = horariosSelecionados.filter(
                            (h) => h === item
                          ).length;
                          if (count >= parametrosEmpresa.qtdeAtendimentoSimultaneoHorario) {
                            Alert.alert(
                              "Limite atingido",
                              "Este horário já atingiu o limite de atendimentos simultâneos."
                            );
                            return;
                          }
                          if (horariosSelecionados.includes(item)) {
                            setHorariosSelecionados(
                              horariosSelecionados.filter((h) => h !== item)
                            );
                          } else {
                            setHorariosSelecionados([...horariosSelecionados, item]);
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
                </>
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
          data={servicos}
          keyExtractor={(item) => String(item.idServico)}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.itemBox,
                servicoSelecionado === item.idServico && styles.itemSelected,
              ]}
              onPress={async () => {
                const novoServico =
                  servicoSelecionado === item.idServico ? null : item.idServico;
                setServicoSelecionado(novoServico);
                if (Object.keys(datasSelecionadas).length && novoServico) {
                  await buscarHorarios(Object.keys(datasSelecionadas));
                } else {
                  setHorariosDisponiveis([]);
                  setHorariosSelecionados([]);
                }
              }}
            >
              <Text>{item.descricao}</Text>
              <Text>R$ {item.valor}</Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal para seleção de serviços */}
      <Modal
        visible={modalServicosVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setModalServicosVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Selecione os serviços</Text>
            <ScrollView>
              {servicos.map((servico) => (
                <TouchableOpacity
                  key={servico.idServico}
                  style={styles.servicoItem}
                  onPress={() => {
                    if (servicosSelecionados.includes(servico.idServico)) {
                      setServicosSelecionados(
                        servicosSelecionados.filter((id) => id !== servico.idServico)
                      );
                    } else {
                      setServicosSelecionados([...servicosSelecionados, servico.idServico]);
                    }
                  }}
                >
                  <Text style={styles.servicoDescricao}>{servico.descricao}</Text>
                  <Text style={styles.servicoValor}>R$ {servico.valor}</Text>
                  {servicosSelecionados.includes(servico.idServico) && (
                    <Icon name="checkmark" size={20} color="#007aff" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={styles.btnConfirmarServicos}
              onPress={() => {
                setModalServicosVisible(false);
                // Lógica para agendar com os serviços selecionados
              }}
            >
              <Text style={styles.textBtnConfirmarServicos}>
                Confirmar Serviços
              </Text>
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
    borderRadius: 12,
    padding: 15,
    marginTop: -50,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  logoEmpresa: {
    width: 60,
    height: 60,
    borderRadius: 30,
    position: "absolute",
    top: -30,
    left: 20,
    borderWidth: 2,
    borderColor: "#fff",
  },
  textosEmpresa: {
    marginLeft: 80,
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  servicoItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  servicoDescricao: {
    fontSize: 16,
  },
  servicoValor: {
    fontSize: 16,
    fontWeight: "bold",
  },
  btnConfirmarServicos: {
    backgroundColor: "#007aff",
    padding: 15,
    borderRadius: 6,
    marginTop: 20,
    alignItems: "center",
  },
  textBtnConfirmarServicos: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Agendamento;
