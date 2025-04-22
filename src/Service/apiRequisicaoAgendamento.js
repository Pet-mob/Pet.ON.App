import api from './api';

const buscarHorariosDisponiveisNaApi = async (idEmpresa, listaDataAgendamento, duracaoEmMin) => {
    try {
        const dtoRequisicao = {
            idEmpresa: idEmpresa,
            listaDataAgendamento: listaDataAgendamento,
            duracaoEmMinutos: duracaoEmMin
        };
        const resposta = await api.post('/Agendamento/HorariosDisponiveis', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao buscar horarios disponiveis:', error);
    };
}

const adicionarAgendamentoNaApi = async (dtoRequisicao) => {
    try {
        const resposta = await api.post('/Agendamento', dtoRequisicao);
        return resposta.data;
    } catch (error) {
        console.error('Erro ao adicionar agendamento:', error);
        throw error;
    }
};

export default {
    buscarHorariosDisponiveisNaApi,
    adicionarAgendamentoNaApi
}