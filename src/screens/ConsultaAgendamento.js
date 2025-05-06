import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
} from "react-native";
import { format } from 'date-fns'
import { Ionicons } from "@expo/vector-icons";
import apiRequisicaoAgendamento from '../Service/apiRequisicaoAgendamento.js'
import { getUsuarioStore } from '../store/store';

const ConsultaAgendamento = ({ navigation }) => {
    const [loading, setLoading] = useState(true);
    const usuarioStore = getUsuarioStore();
    const idUsuario = usuarioStore.id;

    const [consultaAgendamentos, setConsultaAgendamentos] = useState("");

    const [petSelecionado, setPetSelecionado] = useState("");
    const [petShopSelecionado, setPetShopSelecionado] = useState("");
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [servicoSelecionado, setServicoSelecionado] = useState("");

    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);

    const buscarAgendamentosPorUsuario = async (idUsuario) => {
        try {
            const resposta = await apiRequisicaoAgendamento.buscarAgendamentosPorUsuario(idUsuario);
            if (resposta) {
                setConsultaAgendamentos(resposta);
            } else {
                alert("Não há dados cadastrado.");
            }
        } catch (error) {
            alert('Erro ao carregar dados do agendamentos');
        }
    };

    const formatarData = (dataParametro) => {
        return format(dataParametro, 'dd/MM/yyyy');
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

    return (
        <View style={estilos.container}>
            {/* Cabeçalho */}
            <View style={estilos.cabecalho}>
                <TouchableOpacity style={estilos.botaoVoltar} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={estilos.titulo}>Consulta de Agendamentos</Text>
            </View>

            {/* Lista de Agendamentos */}
            <FlatList
                data={consultaAgendamentos}
                keyExtractor={(item) => item.idAgendamento}
                renderItem={({ item }) => (
                    <View style={estilos.agendamentoLinha}>
                        <Image source={{ uri: item.imagem }} style={estilos.imagemPet} />
                        <View>
                            <Text style={estilos.textoAgendamento}>Pet: {item.nomeAnimal}</Text>
                            <Text style={estilos.textoAgendamento}>Serviço: {item.descricaoServico}</Text>
                            <Text style={estilos.textoAgendamento}>Estabelecimento: {item.nomeEmpresa}
                            </Text>
                            <Text style={estilos.textoAgendamento}>Data: {formatarData(item.data)}</Text>
                            <Text style={estilos.textoAgendamento}>Horários: {formatarHorario(item.horarioInicial)} - {formatarHorario(item.horarioFinal)}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={estilos.textoVazio}>
                        Nenhum agendamento encontrado.
                    </Text>
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
        paddingTop: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        elevation: 9,
        position: "relative",
        borderBottomWidth: 1
    },
    botaoVoltar: {
        paddingTop: 50,
        padding: 15,
        position: "absolute",
        left: 1,
    },
    titulo: {
        fontSize: 20,
        fontWeight: "bold",
    },
    agendamentoLinha: {
        flexDirection: "row",
        backgroundColor: '#F9F9F9',
        padding: 15,
        marginTop: 4,
        marginLeft: 15,
        marginBottom: 10,
        borderRadius: 8,
        borderWidth: 1,
        alignItems: "center",
        borderColor: '#EEEEEE',
    },
    imagemPet: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    textoAgendamento: {
        fontSize: 16,
        color: '#000000',
    },
    textoVazio: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
        color: '#000000',
    },
});

export default ConsultaAgendamento;
