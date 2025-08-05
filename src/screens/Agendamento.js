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
import apiRequisicaoParametro from "../Service/apiRequisicaoParametro";

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
    idEmpresa: 1,
    idParametro: 1,
    idModeloTrabalho: 1,
    qtdeAtendimentoSimultaneoHorario: 1,
  });

  const [datasSelecionadas, setDatasSelecionadas] = useState({});
  const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
  const [horariosSelecionados, setHorariosSelecionados] = useState([]);
  const [horariosFuncionamento, setHorariosFuncionamento] = useState([]);
  const empresa = getEmpresaStore();

  // Passo a passo
  // O passo inicial será ajustado após carregar os pets
  const [passo, setPasso] = useState(1); // 1: Pet, 2: Serviço, 3: Data, 4: Horário, 5: Resumo

  // Helpers para validação
  const podeAvancarPet = !!petSelecionado;
  const podeAvancarServico = servicosSelecionados.length > 0;
  const podeAvancarData = Object.keys(datasSelecionadas).length > 0;
  const podeAvancarHorario = horariosSelecionados.length > 0;

  // Carrega pets e serviços filtrando pelo idPorte do pet selecionado
  useEffect(() => {
    carregarDados();
  }, []);

  // Sempre que o petSelecionado mudar, recarrega os serviços filtrando pelo porte
  useEffect(() => {
    if (petSelecionado && pets.length > 0) {
      const pet = pets.find((p) => p.idAnimal === petSelecionado);
      if (pet && pet.idPorte) {
        carregarServicosPorPorte(pet.idPorte);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petSelecionado]);

  const carregarDados = async () => {
    setLoading(true);
    try {
      // Primeiro busca os pets
      const [petsApi, parametrosApi, horarios] = await Promise.all([
        apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(idUsuario),
        apiRequisicaoParametro.buscarParametro(idEmpresaPetShop),
        apiRequisicaoEmpresa.buscarHorarioFuncionamentoEmpresa(
          idEmpresaPetShop
        ),
      ]);

      setPets(petsApi || []);
      // await manipularFotoAnimal(petsApi);

      // Buscar parâmetros da empresa (mock ou ajuste conforme sua API)
      if (parametrosApi) setParametrosEmpresa(parametrosApi);
      setHorariosFuncionamento(horarios || []);

      // Após carregar pets, busca serviços do pet selecionado (ou do único pet)
      let idPortePet = null;
      if (petsApi.length === 1) {
        idPortePet = petsApi[0].idPorte;
        setPetSelecionado(petsApi[0].idAnimal);
        setPasso(2);
      } else {
        setPasso(1);
      }
      if (idPortePet) {
        await carregarServicosPorPorte(idPortePet);
      } else {
        setServicos([]);
      }
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
    }
  };

  // Função para buscar serviços filtrando pelo idPorte
  const carregarServicosPorPorte = async (idPorte) => {
    setLoading(true);
    try {
      const servicosApi = await apiRequisicaoServico.buscarServicosEmpresaNaApi(
        idEmpresaPetShop,
        idPorte
      );
      if (servicosApi) setServicos(servicosApi);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao carregar serviços para o porte do pet.",
      });
    } finally {
      setLoading(false);
    }
  };

  const selecionarData = async (dateString) => {
    // Verifica se é dia de funcionamento
    if (!ehDiaFuncionamento(dateString)) {
      Toast.show({
        type: "warning",
        text1: "Estabelecimento fechado neste dia",
        position: "top",
        visibilityTime: 2000,
      });
      return;
    }

    // Corrige: se não houver servicoSelecionado, mas houver servicosSelecionados, define o primeiro
    let idServico = servicoSelecionado;
    if (!idServico && servicosSelecionados.length > 0) {
      idServico = servicosSelecionados[0];
      setServicoSelecionado(idServico);
    }
    if (!idServico) {
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

    // Garante que a chave é sempre uma string no formato YYYY-MM-DD
    const dataKey =
      typeof dateString === "string"
        ? dateString
        : dateString?.dateString || "";
    if (!dataKey) return;
    const circleMark = {
      selected: true,
      selectedColor: "#007aff",
      selectedTextColor: "#fff",
      disableTouchEvent: false,
    };

    if (ehPacoteMensal) {
      // Permite múltiplas datas, até 4, com pelo menos 7 dias de diferença
      if (datasSelecionadas[dataKey]) {
        // Se já está selecionada, desmarca
        const atualizadas = { ...datasSelecionadas };
        delete atualizadas[dataKey];
        setDatasSelecionadas({ ...atualizadas });
        // console.log("Datas selecionadas (removendo):", { ...atualizadas });
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
        [dataKey]: circleMark,
      };
      setDatasSelecionadas({ ...novasDatas });
      // console.log("Datas selecionadas (adicionando):", { ...novasDatas });
      setTimeout(() => buscarHorarios(Object.keys(novasDatas)), 0);
    } else {
      // Apenas uma data selecionada: sobrescreve
      const novaData = { [dataKey]: circleMark };
      setDatasSelecionadas({ ...novaData });
      // console.log("Datas selecionadas (única):", { ...novaData });
      setTimeout(() => buscarHorarios([dataKey]), 0);
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
    const horarioAtual =
      new Date().getHours().toString().padStart(2, "0") +
      ":" +
      new Date().getMinutes().toString().padStart(2, "0");
    setLoading(true);
    try {
      const { horarios } =
        await apiRequisicaoAgendamento.buscarHorariosDisponiveisNaApi(
          idEmpresaPetShop,
          datasFormatadas,
          duracaoEmMinutos,
          horarioAtual
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
    // Previne múltiplos cliques
    if (confirmando) return;

    // Validação inicial dos campos obrigatórios
    const camposInvalidos = validarCamposObrigatorios();
    if (camposInvalidos) {
      Toast.show({
        type: "warning",
        text1: "Campos obrigatórios",
        text2: camposInvalidos,
        position: "top",
        visibilityTime: 3000,
      });
      return;
    }

    setConfirmando(true);

    try {
      // Busca informações do serviço e pet
      const servico = servicos.find((s) => s.idServico === servicoSelecionado);
      const pet = pets.find((p) => p.idAnimal === petSelecionado);

      if (!servico || !pet) {
        throw new Error("Serviço ou pet não encontrado");
      }

      const duracao = servico.duracao || 120;
      const agendamentos = gerarAgendamentos(servico, pet, duracao);

      // Salva cada agendamento e agenda notificações
      for (const dto of agendamentos) {
        await salvarAgendamentoENotificar(dto, pet, servico);
      }

      // Feedback de sucesso
      exibirMensagemSucesso();

      // Navega de volta após sucesso
      setTimeout(() => {
        navigation.goBack();
      }, 1500);
    } catch (error) {
      exibirMensagemErro(error);
    } finally {
      setConfirmando(false);
    }
  };

  // Funções auxiliares
  const validarCamposObrigatorios = () => {
    if (!petSelecionado) return "Selecione um pet";
    if (!servicoSelecionado) return "Selecione um serviço";
    if (horariosSelecionados.length === 0) return "Selecione um horário";
    if (Object.keys(datasSelecionadas).length === 0)
      return "Selecione uma data";
    return null;
  };

  const gerarAgendamentos = (servico, pet, duracao) => {
    return Object.keys(datasSelecionadas).flatMap((data) => {
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
          horarioFinal: formatarHorario(fim),
          status: "Agendado",
        };
      });
    });
  };

  const formatarHorario = (data) => {
    return `${data.getHours().toString().padStart(2, "0")}:${data
      .getMinutes()
      .toString()
      .padStart(2, "0")}:00`;
  };

  const salvarAgendamentoENotificar = async (dto, pet, servico) => {
    // Salva o agendamento
    const respostaAgendamento =
      await apiRequisicaoAgendamento.adicionarAgendamentoNaApi(dto);

    if (!respostaAgendamento) {
      throw new Error("Falha ao salvar agendamento");
    }
  };

  const exibirMensagemSucesso = () => {
    Toast.show({
      type: "success",
      text1: "Agendamento realizado com sucesso!",
      text2: "Confira os detalhes nos seus agendamentos",
      position: "top",
      visibilityTime: 2000,
    });
  };

  const exibirMensagemErro = (error) => {
    Toast.show({
      type: "error",
      text1: "Erro ao confirmar agendamento",
      text2: error?.message || "Tente novamente mais tarde",
      position: "top",
      visibilityTime: 3000,
    });
  };

  const ehDiaFuncionamento = (date) => {
    const data = new Date(date);
    const diaSemana = [
      "Domingo",
      "Segunda-feira",
      "Terça-feira",
      "Quarta-feira",
      "Quinta-feira",
      "Sexta-feira",
      "Sábado",
    ][data.getDay()];

    // Debug log
    console.log("Verificando funcionamento:", {
      data,
      diaDaSemana: data.getDay(),
      nomeDia: diaSemana,
    });

    const horarioDia = horariosFuncionamento.find(
      (h) => h.nomeDiaSemana === diaSemana
    );

    // Debug log
    console.log("Horário encontrado:", horarioDia);

    if (!horarioDia) return false;

    return horarioDia.funcionaNesseDia;
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007aff" />
      ) : (
        <>
          {/* 1 - Capa e dados da empresa */}
          <ExpoImage
            source={
              empresa?.urlCapaEmpresa
                ? { uri: empresa.urlCapaEmpresa }
                : placeholderImg
            }
            style={styles.capa}
            placeholder={placeholderImg}
            contentFit="cover"
            transition={300}
          />
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
                <Icon name="chevron-back-outline" size={28} color="#007aff" />
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
                <Text
                  style={styles.detalhesLoja}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {empresa?.endereco || "Endereço não informado pela empresa"}
                </Text>
              </View>
            </View>
          </View>
          {/* Passo 1: Pet */}
          {passo === 1 && (
            <>
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
                        item?.urlFotoAnimal
                          ? { uri: item.urlFotoAnimal }
                          : placeholderImg
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
              <View style={styles.footerStep}>
                <TouchableOpacity
                  style={[
                    styles.btnConfirmar,
                    { opacity: podeAvancarPet ? 1 : 0.5 },
                  ]}
                  disabled={!podeAvancarPet}
                  onPress={() => setPasso(2)}
                >
                  <Text style={styles.textBtnConfirmar}>Avançar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {/* Passo 2: Serviços */}
          {passo === 2 && (
            <>
              <TouchableOpacity
                style={styles.btnConfirmar}
                onPress={() => setModalServicosVisible(true)}
              >
                <Text style={styles.textBtnConfirmar}>Selecionar Serviços</Text>
              </TouchableOpacity>
              <Text style={styles.label}>Serviços selecionados:</Text>
              {servicosSelecionados.length === 0 ? (
                <Text style={{ color: "#888", marginVertical: 8 }}>
                  Nenhum serviço selecionado.
                </Text>
              ) : (
                servicos
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
                  ))
              )}
              <View style={styles.footerStep}>
                <TouchableOpacity
                  style={[
                    styles.btnConfirmar,
                    { opacity: podeAvancarServico ? 1 : 0.5 },
                  ]}
                  disabled={!podeAvancarServico}
                  onPress={() => setPasso(3)}
                >
                  <Text style={styles.textBtnConfirmar}>Avançar</Text>
                </TouchableOpacity>
                {/* Só mostra o botão Voltar se o usuário veio do passo 1 (ou seja, tem mais de 1 pet) */}
                {pets.length > 1 && (
                  <TouchableOpacity
                    style={[
                      styles.btnConfirmar,
                      { backgroundColor: "#aaa", marginTop: 10 },
                    ]}
                    onPress={() => setPasso(1)}
                  >
                    <Text style={styles.textBtnConfirmar}>Voltar</Text>
                  </TouchableOpacity>
                )}
              </View>
            </>
          )}
          {/* Passo 3: Data */}
          {passo === 3 && (
            <>
              <Text style={styles.label}>Selecione data:</Text>
              <Calendar
                markedDates={datasSelecionadas}
                onDayPress={selecionarData}
                minDate={new Date().toISOString().split("T")[0]}
                enableSwipeMonths={true}
                theme={{
                  selectedDayBackgroundColor: "#007aff",
                  selectedDayTextColor: "#fff",
                  todayTextColor: "#007aff",
                  arrowColor: "#007aff",
                  dotColor: "#007aff",
                  textDayFontWeight: "bold",
                  textMonthFontWeight: "bold",
                  textDayHeaderFontWeight: "bold",
                }}
                dayComponent={({ date, state }) => {
                  const currentDate = new Date(date.dateString);
                  const isWorkingDay = ehDiaFuncionamento(date.dateString);
                  const isSelected = datasSelecionadas[date.dateString];
                  const today = new Date().toISOString().split("T")[0];
                  const isPastDay = date.dateString < today;

                  // Debug log for each day being rendered
                  console.log("Rendering day:", {
                    date: date.dateString,
                    state,
                    isWorkingDay,
                    isPastDay,
                  });

                  // Only disable if it's a past day or non-working day
                  const isDisabled = isPastDay || !isWorkingDay;

                  return (
                    <TouchableOpacity
                      style={[
                        styles.calendarDay,
                        isSelected && styles.calendarDaySelected,
                        !isWorkingDay && styles.calendarDayNotWorking,
                        isPastDay && styles.calendarDayDisabled,
                      ]}
                      onPress={() => {
                        if (!isDisabled) {
                          selecionarData(date.dateString);
                        }
                      }}
                      disabled={isDisabled}
                    >
                      <Text
                        style={[
                          styles.calendarDayText,
                          isSelected && styles.calendarDayTextSelected,
                          !isWorkingDay && styles.calendarDayTextNotWorking,
                          isPastDay && styles.calendarDayTextDisabled,
                        ]}
                      >
                        {date.day}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              />
              <View style={styles.footerStep}>
                <TouchableOpacity
                  style={[
                    styles.btnConfirmar,
                    { opacity: podeAvancarData ? 1 : 0.5 },
                  ]}
                  disabled={!podeAvancarData}
                  onPress={() => setPasso(4)}
                >
                  <Text style={styles.textBtnConfirmar}>Avançar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btnConfirmar,
                    { backgroundColor: "#aaa", marginTop: 10 },
                  ]}
                  onPress={() => setPasso(2)}
                >
                  <Text style={styles.textBtnConfirmar}>Voltar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {/* Passo 4: Horário */}
          {passo === 4 && (
            <>
              {horariosDisponiveis.length > 0 ? (
                <>
                  <Text style={styles.label}>Horários disponíveis:</Text>
                  <FlatList
                    data={horariosDisponiveis}
                    keyExtractor={(item) =>
                      typeof item === "string" ? item : item.horario
                    }
                    numColumns={3}
                    columnWrapperStyle={{ justifyContent: "flex-start" }}
                    renderItem={({ item }) => {
                      const horario =
                        typeof item === "string" ? item : item.horario;
                      const agendados =
                        typeof item === "string" ? 0 : item.agendados || 0;
                      const capacidade =
                        parametrosEmpresa.qtdeAtendimentoSimultaneoHorario || 1;
                      const esgotado = agendados >= capacidade;
                      return (
                        <TouchableOpacity
                          style={[
                            styles.horarioBox,
                            horariosSelecionados.includes(horario) &&
                              styles.horarioSelecionado,
                            esgotado && {
                              backgroundColor: "#eee",
                              borderColor: "#ccc",
                            },
                            { flex: 1, margin: 5, minWidth: 90, maxWidth: 120 },
                          ]}
                          onPress={() => {
                            if (esgotado) return;
                            if (horariosSelecionados.includes(horario)) {
                              setHorariosSelecionados([]);
                            } else {
                              setHorariosSelecionados([horario]);
                            }
                          }}
                          disabled={esgotado}
                        >
                          <Text
                            style={{
                              color: horariosSelecionados.includes(horario)
                                ? "#fff"
                                : esgotado
                                ? "#bbb"
                                : "#000",
                              fontWeight: esgotado ? "normal" : "bold",
                              textAlign: "center",
                            }}
                          >
                            {horario}
                            {esgotado ? " (Esgotado)" : ""}
                          </Text>
                        </TouchableOpacity>
                      );
                    }}
                  />
                </>
              ) : (
                <Text style={{ color: "#888", marginVertical: 16 }}>
                  Selecione uma data para ver horários disponíveis.
                </Text>
              )}
              <View style={styles.footerStep}>
                <TouchableOpacity
                  style={[
                    styles.btnConfirmar,
                    { opacity: podeAvancarHorario ? 1 : 0.5 },
                  ]}
                  disabled={!podeAvancarHorario}
                  onPress={() => setPasso(5)}
                >
                  <Text style={styles.textBtnConfirmar}>Avançar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btnConfirmar,
                    { backgroundColor: "#aaa", marginTop: 10 },
                  ]}
                  onPress={() => setPasso(3)}
                >
                  <Text style={styles.textBtnConfirmar}>Voltar</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
          {/* Passo 5: Resumo e confirmação */}
          {passo === 5 && (
            <>
              <Text style={styles.label}>Resumo do Agendamento</Text>
              <View style={styles.resumoContainer}>
                {/* Pet */}
                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoTitulo}>Pet:</Text>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {(() => {
                      const pet = pets.find(
                        (p) => p.idAnimal === petSelecionado
                      );
                      if (!pet)
                        return <Text style={styles.resumoValor}>-</Text>;
                      return (
                        <>
                          <ExpoImage
                            source={
                              typeof pet.imagem === "string"
                                ? { uri: pet.imagem }
                                : pet.imagem
                            }
                            style={styles.resumoPetImg}
                            placeholder={placeholderImg}
                            contentFit="cover"
                          />
                          <Text style={styles.resumoValor}>{pet.nome}</Text>
                        </>
                      );
                    })()}
                  </View>
                </View>
                {/* Serviços */}
                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoTitulo}>Serviços:</Text>
                  <View style={{ flex: 1 }}>
                    {servicos
                      .filter((s) => servicosSelecionados.includes(s.idServico))
                      .map((s) => (
                        <View
                          key={s.idServico}
                          style={styles.resumoServicoLinha}
                        >
                          <Text style={styles.resumoServicoNome}>
                            {s.descricao}
                          </Text>
                          <Text style={styles.resumoServicoValor}>
                            R$ {s.valor}
                          </Text>
                        </View>
                      ))}
                  </View>
                </View>
                {/* Datas */}
                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoTitulo}>Data(s):</Text>
                  <Text style={styles.resumoValor}>
                    {Object.keys(datasSelecionadas)
                      .map((data) => {
                        const [ano, mes, dia] = data.split("-");
                        return `${dia}/${mes}/${ano}`;
                      })
                      .join(", ")}
                  </Text>
                </View>
                {/* Horários */}
                <View style={styles.resumoLinha}>
                  <Text style={styles.resumoTitulo}>Horário(s):</Text>
                  <Text style={styles.resumoValor}>
                    {horariosSelecionados.join(", ")}
                  </Text>
                </View>
              </View>
              <View style={styles.footerStep}>
                <TouchableOpacity
                  style={styles.btnConfirmar}
                  onPress={confirmarAgendamento}
                  disabled={confirmando}
                >
                  <Text style={styles.textBtnConfirmar}>
                    {confirmando ? "Confirmando..." : "Confirmar Agendamento"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.btnConfirmar,
                    { backgroundColor: "#aaa", marginTop: 10 },
                  ]}
                  onPress={() => setPasso(4)}
                >
                  <Text style={styles.textBtnConfirmar}>Voltar</Text>
                </TouchableOpacity>
              </View>
            </>
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
                <Text style={styles.modalTitlePrint}>
                  Selecione os serviços:
                </Text>
                <FlatList
                  data={servicos}
                  keyExtractor={(item) => String(item.idServico)}
                  renderItem={({ item }) => {
                    const selecionado = servicosSelecionados.includes(
                      item.idServico
                    );
                    // Agrupado: só pode selecionar 1 serviço
                    // Separado: pode selecionar vários, mas só 1 por "tipo" (aqui, assume-se que cada serviço é único)
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
                            if (parametrosEmpresa.idModeloTrabalho === 1) {
                              // Agrupado: só 1 serviço
                              if (selecionado) {
                                setServicosSelecionados([]);
                                setServicoSelecionado(null);
                              } else {
                                setServicosSelecionados([item.idServico]);
                                setServicoSelecionado(item.idServico);
                              }
                            } else if (
                              parametrosEmpresa.idModeloTrabalho === 2
                            ) {
                              // Separado: múltiplos, mas só 1 por serviço (cada serviço é único)
                              let novaSelecao;
                              if (selecionado) {
                                novaSelecao = servicosSelecionados.filter(
                                  (id) => id !== item.idServico
                                );
                              } else {
                                novaSelecao = [
                                  ...servicosSelecionados,
                                  item.idServico,
                                ];
                              }
                              setServicosSelecionados(novaSelecao);
                              // Sempre mantém servicoSelecionado igual ao primeiro da lista (ou null)
                              setServicoSelecionado(
                                novaSelecao.length > 0 ? novaSelecao[0] : null
                              );
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
        </>
      )}
      {/* <Toast ref={(ref) => Toast.setRef(ref)} /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  resumoContainer: {
    backgroundColor: "#f7faff",
    borderRadius: 14,
    padding: 18,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: "#e0e8f0",
    shadowColor: "#007aff",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  resumoLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  resumoTitulo: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#007aff",
    minWidth: 90,
  },
  resumoValor: {
    fontSize: 15,
    color: "#222",
    marginLeft: 8,
    flexShrink: 1,
  },
  resumoPetImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: "#007aff",
    backgroundColor: "#fff",
  },
  resumoServicoLinha: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  resumoServicoNome: {
    fontSize: 15,
    color: "#222",
    flex: 1,
  },
  resumoServicoValor: {
    fontSize: 15,
    color: "#007aff",
    fontWeight: "bold",
    marginLeft: 8,
  },
  container: { flex: 1, padding: 10, backgroundColor: "#fff" },
  footerStep: {
    marginTop: "auto",
    paddingBottom: 10,
    paddingTop: 10,
    backgroundColor: "#fff",
  },
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
    gap: 5,
    marginBottom: 15,
    padding: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#f7faff",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    width: 90,
    height: 120,
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    flex: 1,
    maxWidth: 90,
    maxHeight: 120,
    minWidth: 90,
    minHeight: 120,
    flexGrow: 0,
    flexShrink: 0,
    flexBasis: "auto",
    flexDirection: "column",
    alignSelf: "flex-start",
    backgroundColor: "#f7faff",
    shadowColor: "#007aff",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
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
    backgroundColor: "#43b581",
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
  calendarDay: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
    margin: 2,
  },
  calendarDaySelected: {
    backgroundColor: "#007aff",
  },
  calendarDayDisabled: {
    backgroundColor: "#f0f0f0",
    opacity: 0.4,
  },
  calendarDayNotWorking: {
    backgroundColor: "#ffebee", // Light red background for non-working days
    borderColor: "#ffcdd2",
    borderWidth: 1,
  },
  calendarDayText: {
    color: "#000",
    fontSize: 16,
  },
  calendarDayTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
  calendarDayTextDisabled: {
    color: "#bbb",
  },
  calendarDayTextNotWorking: {
    color: "#d32f2f", // Red text for non-working days
  },
});

export default Agendamento;
