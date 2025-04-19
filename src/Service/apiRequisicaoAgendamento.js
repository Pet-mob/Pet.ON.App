import api from './api';

export const buscarHorariosDisponiveisNaApi = async (idEmpresa, listaDataAgendamento, duracaoEmMin) => {
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
