import api from "./api";

const buscarHorariosDisponiveisNaApi = async (
  idEmpresa,
  listaDataAgendamento,
  duracaoEmMin
) => {
  try {
    const dtoRequisicao = {
      idEmpresa: idEmpresa,
      listaDataAgendamento: listaDataAgendamento,
      duracaoEmMinutos: duracaoEmMin,
    };
    const resposta = await api.post(
      "/Agendamento/HorariosDisponiveis",
      dtoRequisicao
    );
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar horarios disponiveis:", error);
  }
};

const adicionarAgendamentoNaApi = async (dtoRequisicao) => {
  try {
    const resposta = await api.post("/Agendamento", dtoRequisicao);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao adicionar agendamento:", error);
    throw error;
  }
};

const buscarAgendamentosPorUsuario = async (idUsuarioLogado) => {
  try {
    const dtoRequestGetAgendamento = {
      idUsuario: idUsuarioLogado,
    };
    const resposta = await api.get("/Agendamento?IdUsuario=" + idUsuarioLogado);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    throw error;
  }
};

const buscarQtdeAgendamentosDia = async (
  idEmpresa,
  dataAgendamento,
  horarioAgendamento
) => {
  try {
    const uri = `/Agendamento/QtdeAgendamentosDia?idEmpresa=${idEmpresa}&dataAgendamento=${dataAgendamento}&horario=${horarioAgendamento}`;
    const resposta = await api.get(uri);
    return resposta.data;
  } catch (error) {
    console.error("Erro ao buscar agendamento:", error);
    throw error;
  }
};

export default {
  buscarHorariosDisponiveisNaApi,
  buscarQtdeAgendamentosDia,
  adicionarAgendamentoNaApi,
  buscarAgendamentosPorUsuario,
};
