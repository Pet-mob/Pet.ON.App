import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Switch,
    ActivityIndicator
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from "react-native-calendars";
import { getUsuarioStore } from '../store/store';
import apiRequisicaoAgendamento from '../Service/apiRequisicaoAgendamento.js'
import apiRequisicaoAnimal from '../Service/apiRequisicaoAnimal'
import apiRequisicaoServico from '../Service/apiRequisicaoServico'

const Agendamento = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const { idEmpresaPetShop } = route.params;
    const usuarioStore = getUsuarioStore();
    const idUsuario = usuarioStore.id;

    const [servicosDisponivelEmpresa, setServicosDisponivelEmpresa] = useState([]);

    const [petDisponivel, setPetDisponivel] = useState([]);
    const [petSelecionado, setPetSelecionado] = useState(null);

    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [horariosSelecionados, setHorariosSelecionados] = useState([]);

    const [ehPacoteMensal, setehPacoteMensal] = useState(false);

    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [dataSelecionadas, setDataSelecionadas] = useState({});

    // falta olhar variaveis

    const SelecionarTipoAgendamento = () => {
        setehPacoteMensal((prev) => !prev);
    };

    const SelecionarPet = (petId) => {
        setPetSelecionado(petId);
    };

    const SelecionarServico = (idServico) => {
        setServicoSelecionado(idServico === servicoSelecionado ? null : idServico);
    };

    const ehDataAnteriorHoje = (dataSelecionada) => {
        const hoje = new Date().toISOString().split('T')[0];
        return dataSelecionada < hoje;
    };

    const existeDataComIntervaloMenorQue7Dias = (dataSelecionada, datasSelecionadas) => {
        const novaData = new Date(dataSelecionada);
        return Object.keys(datasSelecionadas).some((data) => {
            const dataExistente = new Date(data);
            const diffEmDias = Math.abs((novaData - dataExistente) / (1000 * 60 * 60 * 24));
            return diffEmDias < 7;
        });
    };

    const desmarcarData = (dataSelecionada, datasSelecionadas, setDataSelecionadas) => {
        const atualizarDatas = { ...datasSelecionadas };
        delete atualizarDatas[dataSelecionada];
        setDataSelecionadas(atualizarDatas);
    };

    const marcarDataPacoteMensal = (dataSelecionada, datasSelecionadas, setDataSelecionadas, selecionarDataParaExibirHorario) => {
        setDataSelecionadas({
            ...datasSelecionadas,
            [dataSelecionada]: { selected: true, marked: true, selectedColor: '#81b0ff' },
        });
        const listaDataAgendamento = Object.keys(dataSelecionadas);
        selecionarDataParaExibirHorario(listaDataAgendamento);
    };

    const marcarDataAvulsa = (dataSelecionada, setDataSelecionadas, selecionarDataParaExibirHorario) => {
        setDataSelecionadas({
            [dataSelecionada]: { selected: true, marked: true, selectedColor: '#81b0ff' },
        });
        selecionarDataParaExibirHorario([dataSelecionada]);
    };

    const SelecionarData = (dia) => {
        const dataSelecionada = dia.dateString;

        if (ehDataAnteriorHoje(dataSelecionada)) {
            alert('Data inválida', 'Não é possível selecionar uma data anterior a hoje.');
            return;
        }

        if (ehPacoteMensal) {
            setHorariosDisponiveis([]);

            if (dataSelecionadas[dataSelecionada]) {
                desmarcarData(dataSelecionada, dataSelecionadas, setDataSelecionadas);
            } else {
                if (existeDataComIntervaloMenorQue7Dias(dataSelecionada, dataSelecionadas)) {
                    alert('Intervalo inválido', 'As datas selecionadas devem ter no mínimo 7 dias de diferença.');
                    return;
                }

                if (Object.keys(dataSelecionadas).length >= 4) {
                    alert('Limite atingido', 'Você só pode selecionar até 4 datas para um pacote mensal.');
                    return;
                }

                marcarDataPacoteMensal(dataSelecionada, dataSelecionadas, setDataSelecionadas, selecionarDataParaExibirHorario);
            }
        } else {
            marcarDataAvulsa(dataSelecionada, setDataSelecionadas, selecionarDataParaExibirHorario);
        }
    };

    const buscarHorariosDisponiveis = async (idEmpresaPetShop, listaDataAgendamento, duracaoEmMin) => {
        setLoading(true);  // Define o loading como true antes de fazer a requisição
        try {
            if (listaDataAgendamento.length === 0) {
                alert("Selecione pelo menos uma data para buscar horários.");
            }
            const resposta = await apiRequisicaoAgendamento.buscarHorariosDisponiveisNaApi(idEmpresaPetShop, listaDataAgendamento, duracaoEmMin);
            if (resposta && resposta.horarios?.length > 0) {
                setHorariosDisponiveis(resposta.horarios);
            } else {
                alert("Não há horários disponíveis em comum nas datas selecionadas.");
            }
            setLoading(false);
        } catch (error) {
            alert('Erro ao carregar dados da empresa:');
        }
    };

    const buscarAnimal = async (idUsuario) => {
        try {
            const resposta = await apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(idUsuario);
            if (resposta) {
                setPetDisponivel(resposta);
            } else {
                alert("Não há pet cadastrado.");
            }
        } catch (error) {
            alert('Erro ao carregar dados do pet');
        }
    };

    const buscarServicosEmpresa = async (idEmpresaPetShop) => {
        try {
            const resposta = await apiRequisicaoServico.buscarServicosEmpresaNaApi(idEmpresaPetShop);
            if (resposta) {
                setServicosDisponivelEmpresa(resposta);
            } else {
                alert("Não há serviços cadastrado.");
            }
        } catch (error) {
            alert('Erro ao carregar dados do serviço');
        }
    };

    const selecionarDataParaExibirHorario = async (listaDataAgendamento) => {
        await buscarHorariosDisponiveis(idEmpresaPetShop, listaDataAgendamento, 120)
        setHorariosSelecionados([]); // Reseta os horários selecionados ao mudar de data
    };

    //rotinas que ja revisei - pra cima.

    const SelecionarHorario = (horario) => {
        setHorariosSelecionados((prev) =>
            prev.includes(horario)
                ? prev.filter((item) => item !== horario)
                : [...prev, horario]
        );
    };

    const ConfirmarAgendamento = async () => {
        if (!petSelecionado || !servicoSelecionado || horariosSelecionados.length === 0 || Object.keys(dataSelecionadas).length === 0) {
            alert("Preencha todos os campos antes de confirmar o agendamento.");
            return;
        }

        const listaDataHoraAgendamento = [];

        Object.keys(dataSelecionadas).forEach((data) => {
            horariosSelecionados.forEach((horario) => {
                const [hora, minuto] = horario.split(':');
                const horarioTimeSpan = `${hora}:${minuto}:00`;

                const horarioFinal = new Date(`${data}T${horario}`);
                horarioFinal.setMinutes(horarioFinal.getMinutes() + 120); // duração fixa de 2h (120 min)

                const horarioFinalStr = `${horarioFinal.getHours().toString().padStart(2, '0')}:${horarioFinal.getMinutes().toString().padStart(2, '0')}:00`;

                listaDataHoraAgendamento.push({
                    data: data,
                    horarioInicial: horarioTimeSpan,
                    horarioFinal: horarioFinalStr,
                });
            });
        });

        try {
            for (const item of listaDataHoraAgendamento) {
                const dto = {
                    idServico: servicoSelecionado,
                    idAnimal: petSelecionado,
                    idUsuario: idUsuario,
                    idEmpresa: idEmpresaPetShop,
                    pacoteMensal: ehPacoteMensal,
                    listaDatasAgendamento: [item.data],
                    horario: item.horarioInicial,
                    horarioFinal: item.horarioFinal,
                    status: "Agendado"
                };

                await apiRequisicaoAgendamento.adicionarAgendamentoNaApi(dto);
            }

            alert("Agendamento realizado com sucesso!");
            navigation.goBack();

        } catch (error) {
            alert("Erro ao confirmar agendamento.");
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            await buscarServicosEmpresa(idEmpresaPetShop);
            await buscarAnimal(idUsuario);
            setLoading(false);
        };

        carregarDados();
    }, []);

    return (
        <View style={estilos.container}>
            <View style={estilos.cabecalho}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={estilos.botaoVoltar}>
                    <Icon name="arrow-back" size={30} color="#000" style={estilos.iconeBotaoVoltar} />
                </TouchableOpacity>
                <Text style={estilos.titulo}>Agendamento</Text>
            </View>
            <FlatList
                style={estilos.scrollContainer}
                ListHeaderComponent={
                    <>
                        {/* <Image
                            source={require('../../assets/loja1.png')}
                            style={estilos.imagem}
                            resizeMode="contain"
                        /> */}
                        <View style={estilos.switchContainer}>
                            <Text style={estilos.subTitulo}>Tipo do agendamento:</Text>
                            <Text style={estilos.subTitulo}>
                                {ehPacoteMensal ? 'Pacote mensal' : 'Avulso'}
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={ehPacoteMensal ? '#007aff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={SelecionarTipoAgendamento}
                                value={ehPacoteMensal}
                            />
                        </View>
                        <Text style={estilos.subTitulo}>Escolha serviço:</Text>
                    </>
                }
                data={servicosDisponivelEmpresa}
                keyExtractor={(item) => item.idServico}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => SelecionarServico(item.idServico)}
                        style={[
                            estilos.servicoLinha,
                            servicoSelecionado === item.idServico && estilos.servicoSelecionado,
                        ]}
                    >
                        <Text style={estilos.descricaoServico}>{item.descricao}</Text>
                        <Text style={estilos.valorServico}>{item.valor}</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={
                    <>
                        <Text style={estilos.subTitulo}>Selecione data:</Text>
                        <Calendar
                            onDayPress={SelecionarData}
                            markedDates={dataSelecionadas}
                        />
                        {dataSelecionadas && horariosDisponiveis.length >= 1 && (
                            <>
                                <Text style={estilos.subTitulo}>
                                    Horários disponíveis:
                                </Text>
                                <FlatList
                                    data={horariosDisponiveis}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                estilos.horarioLinha,
                                                horariosSelecionados.includes(item) &&
                                                estilos.horarioLinhaSelecionado,
                                            ]}
                                            onPress={() => SelecionarHorario(item)}
                                        >
                                            <Text
                                                style={[
                                                    estilos.horarioTexto,
                                                    horariosSelecionados.includes(item) &&
                                                    estilos.horarioTextoSelecionado,
                                                ]}
                                            >
                                                {item}
                                            </Text>
                                        </TouchableOpacity>
                                    )}
                                    horizontal
                                    nestedScrollEnabled
                                />
                            </>
                        )}

                        {/* pets */}
                        {petDisponivel.length > 2 && (<View>
                            <Text style={estilos.subTitulo}>Qual pet irá realizar o agendamento?:</Text>
                            <FlatList
                                data={petDisponivel}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            estilos.petLinha,
                                            petSelecionado.id === item.id && estilos.petLinhaSelecionado,
                                        ]}
                                        onPress={() => SelecionarPet(item)}
                                    >
                                        <View style={estilos.petGrupo}>
                                            <Image
                                                source={{ uri: item.imagem }}
                                                style={estilos.petImagem}
                                            />
                                            <Text style={estilos.nomePet}>{item.nome}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                horizontal
                                nestedScrollEnabled
                            />
                        </View>
                        )}

                        <TouchableOpacity style={estilos.botaoConfirmar} onPress={() => ConfirmarAgendamento()}>
                            <Text style={estilos.botaoConfirmarTexto}>Confirmar agendamento</Text>
                        </TouchableOpacity>
                    </>
                }
            />
        </View>
    );
};


const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    //cabeçalho
    cabecalho: {
        marginTop: '10%',
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
    },
    imagem: {
        width: '100%',
        height: 280,
    },
    titulo: {
        alignItems: 'center',
        left: '25%',
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconeBotaoVoltar: {
        position: 'absolute',
    },
    botaoVoltar: {
        flexDirection: 'column',
        width: 30,
    },
    //corpo
    scrollContainer: {
        paddingLeft: 10,
        paddingRight: 10
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subTitulo: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
    },
    servicoSelecionado: {
        backgroundColor: '#81b0ff',
    },
    servicoLinha: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: 10,
    },
    descricaoServico: {
        fontSize: 16,
        color: '#000000',
    },
    valorServico: {
        fontSize: 16,
        color: '#28A745',
        fontWeight: '600',
    },
    horarioLinha: {
        padding: 15,
        marginHorizontal: 8,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
        alignItems: "center"
    },
    horarioLinhaSelecionado: { backgroundColor: "#81b0ff" },
    horarioTexto: { fontSize: 16, color: "#000" },
    horarioTextoSelecionado: { fontSize: 16, color: "#81b0ff" },
    petLinha: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
    },
    petImagem: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    nomePet: {
        fontSize: 16,
        // fontWeight: "bold",
        textAlign: "center", // Centraliza o texto
    },
    petLinhaSelecionado: {
        backgroundColor: "#81b0ff",
        borderColor: "#007bff",
    },
    petGrupo: {
        flexDirection: "row", // Organiza a imagem e o texto em coluna
        alignItems: "center",   // Centraliza os itens horizontalmente
    },
    botaoConfirmar: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    botaoConfirmarTexto: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Agendamento;
