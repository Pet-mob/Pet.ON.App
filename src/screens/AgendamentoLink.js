import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    Modal,
    ScrollView,
    TextInput,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiRequisicaoEmpresa from "../Service/apiRequisicaoEmpresa";
import apiRequisicaoServico from "../Service/apiRequisicaoServico";
import apiRequisicaoAgendamento from "../Service/apiRequisicaoAgendamento";
import Toast from "react-native-toast-message";
import { Calendar } from "react-native-calendars";

const AgendamentoLink = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const [loading, setLoading] = useState(true);
    const [empresa, setEmpresa] = useState(null);
    const [erro, setErro] = useState("");

    // Steps
    const [step, setStep] = useState(1); // 1: Serviço, 2: Data, 3: Horário, 4: Cadastro, 5: Resumo
    const [servicos, setServicos] = useState([]);
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [porteSelecionado, setPorteSelecionado] = useState("");
    const [datasSelecionadas, setDatasSelecionadas] = useState({});
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [horarioSelecionado, setHorarioSelecionado] = useState("");
    const [modalServicosVisible, setModalServicosVisible] = useState(false);

    // Cadastro simplificado
    const [nome, setNome] = useState("");
    const [telefone, setTelefone] = useState("");
    const [email, setEmail] = useState("");
    const [petNome, setPetNome] = useState("");
    const [petObservacoes, setPetObservacoes] = useState("");

    useEffect(() => {
        const init = async () => {
            try {
                const idEmpresa = route.params?.empresaId;
                if (!idEmpresa) {
                    setErro("Link inválido. Solicite um novo link ao seu pet shop.");
                    setLoading(false);
                    return;
                }
                // Checa se o usuário já usou o link antes
                const jaUsou = await AsyncStorage.getItem(`linkUsado_${idEmpresa}`);
                if (jaUsou) {
                    Toast.show({
                        type: "info",
                        text1: "Você já utilizou esse acesso.",
                        text2: "Faça login normalmente para continuar!",
                    });
                    navigation.replace("Login");
                    return;
                }
                await AsyncStorage.setItem("empresaIdLink", String(idEmpresa));
                const dados = await apiRequisicaoEmpresa.buscarEmpresaPorId(idEmpresa);
                if (!dados) {
                    setErro("Empresa não encontrada.");
                } else {
                    setEmpresa(dados);
                    // Carregar serviços
                    const servicosApi = await apiRequisicaoServico.buscarServicosEmpresaNaApi(idEmpresa);
                    setServicos(servicosApi || []);
                }
            } catch (e) {
                setErro("Erro ao carregar dados da empresa.");
            }
            setLoading(false);
        };
        init();
    }, [route.params]);

    // Step 1: Serviço e porte
    const podeAvancarServico = servicoSelecionado && porteSelecionado;
    // Step 2: Data
    const podeAvancarData = Object.keys(datasSelecionadas).length > 0;
    // Step 3: Horário
    const podeAvancarHorario = !!horarioSelecionado;
    // Step 4: Cadastro
    const podeAvancarCadastro = nome && telefone && email && petNome;

    // Buscar horários disponíveis (mock/simples)
    const buscarHorarios = () => {
        setLoading(true);
        setTimeout(() => {
            setHorariosDisponiveis(["09:00", "10:00", "11:00", "14:00", "15:00"]);
            setLoading(false);
        }, 500);
    };

    // Step 5: Confirmar agendamento (mock)
    const confirmarAgendamento = async () => {
        setLoading(true);
        // Marca o link como usado para esse idEmpresa
        await AsyncStorage.setItem(`linkUsado_${route.params?.empresaId}`, "1");
        setTimeout(() => {
            setLoading(false);
            Toast.show({
                type: "success",
                text1: "Agendamento realizado!",
                text2: "Você receberá a confirmação por WhatsApp.",
            });
            navigation.goBack();
        }, 1200);
    };

    if (loading) {
        return (
            <View style={styles.centered}>
                <ActivityIndicator size="large" color="#4F46E5" />
                <Text style={{ marginTop: 16 }}>Carregando informações...</Text>
            </View>
        );
    }

    if (erro) {
        return (
            <View style={styles.centered}>
                <Text style={{ color: "red", fontWeight: "bold" }}>{erro}</Text>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.botao}>
                    <Text style={styles.botaoTexto}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <ScrollView style={{ flex: 1, backgroundColor: "#F9F9F9" }} contentContainerStyle={{ flexGrow: 1 }}>
            <View style={styles.container}>
                <Text style={styles.titulo}>Agendamento rápido para clientes {empresa.nome}</Text>
                {/* Step 1: Serviço e porte */}
                {step === 1 && (
                    <>
                        <Text style={styles.label}>Escolha o serviço:</Text>
                        <TouchableOpacity style={styles.botao} onPress={() => setModalServicosVisible(true)}>
                            <Text style={styles.botaoTexto}>{servicoSelecionado ? servicos.find(s => s.idServico === servicoSelecionado)?.descricao : "Selecionar serviço"}</Text>
                        </TouchableOpacity>
                        <Text style={styles.label}>Porte do pet:</Text>
                        <View style={{ flexDirection: "row", justifyContent: "center", marginBottom: 20 }}>
                            {[{ label: "Pequeno", value: "1" }, { label: "Médio", value: "2" }, { label: "Grande", value: "3" }].map((porte) => (
                                <TouchableOpacity
                                    key={porte.value}
                                    style={[styles.porteBtn, porteSelecionado === porte.value && styles.porteBtnSel]}
                                    onPress={() => setPorteSelecionado(porte.value)}
                                >
                                    <Text style={{ color: porteSelecionado === porte.value ? "#fff" : "#4F46E5" }}>{porte.label}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                        <TouchableOpacity style={[styles.botao, { opacity: podeAvancarServico ? 1 : 0.5 }]} disabled={!podeAvancarServico} onPress={() => setStep(2)}>
                            <Text style={styles.botaoTexto}>Avançar</Text>
                        </TouchableOpacity>
                        <Modal visible={modalServicosVisible} animationType="slide" transparent onRequestClose={() => setModalServicosVisible(false)}>
                            <View style={styles.modalSheet}>
                                <Text style={styles.label}>Selecione o serviço:</Text>
                                <FlatList
                                    data={servicos}
                                    keyExtractor={item => String(item.idServico)}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={{ padding: 16, borderBottomWidth: 1, borderColor: "#eee" }}
                                            onPress={() => {
                                                setServicoSelecionado(item.idServico);
                                                setModalServicosVisible(false);
                                            }}
                                        >
                                            <Text>{item.descricao}</Text>
                                        </TouchableOpacity>
                                    )}
                                />
                                <TouchableOpacity style={[styles.botao, { marginTop: 16 }]} onPress={() => setModalServicosVisible(false)}>
                                    <Text style={styles.botaoTexto}>Fechar</Text>
                                </TouchableOpacity>
                            </View>
                        </Modal>
                    </>
                )}
                {/* Step 2: Data */}
                {step === 2 && (
                    <>
                        <Text style={styles.label}>Selecione a data:</Text>
                        <Calendar
                            markedDates={datasSelecionadas}
                            onDayPress={({ dateString }) => setDatasSelecionadas({ [dateString]: { selected: true, selectedColor: "#4F46E5" } })}
                            minDate={new Date().toISOString().split("T")[0]}
                            theme={{
                                selectedDayBackgroundColor: "#4F46E5",
                                selectedDayTextColor: "#fff",
                                todayTextColor: "#4F46E5",
                                arrowColor: "#4F46E5",
                            }}
                        />
                        <TouchableOpacity style={[styles.botao, { opacity: podeAvancarData ? 1 : 0.5 }]} disabled={!podeAvancarData} onPress={() => { buscarHorarios(); setStep(3); }}>
                            <Text style={styles.botaoTexto}>Avançar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botao, { backgroundColor: "#aaa", marginTop: 10 }]} onPress={() => setStep(1)}>
                            <Text style={styles.botaoTexto}>Voltar</Text>
                        </TouchableOpacity>
                    </>
                )}
                {/* Step 3: Horário */}
                {step === 3 && (
                    <>
                        <Text style={styles.label}>Horários disponíveis:</Text>
                        <FlatList
                            data={horariosDisponiveis}
                            keyExtractor={item => item}
                            numColumns={3}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={[styles.horarioBox, horarioSelecionado === item && styles.horarioSelecionado]}
                                    onPress={() => setHorarioSelecionado(item)}
                                >
                                    <Text style={{ color: horarioSelecionado === item ? "#fff" : "#4F46E5" }}>{item}</Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={{ color: "#888", marginVertical: 16 }}>Selecione uma data para ver horários.</Text>}
                        />
                        <TouchableOpacity style={[styles.botao, { opacity: podeAvancarHorario ? 1 : 0.5 }]} disabled={!podeAvancarHorario} onPress={() => setStep(4)}>
                            <Text style={styles.botaoTexto}>Avançar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botao, { backgroundColor: "#aaa", marginTop: 10 }]} onPress={() => setStep(2)}>
                            <Text style={styles.botaoTexto}>Voltar</Text>
                        </TouchableOpacity>
                    </>
                )}
                {/* Step 4: Cadastro */}
                {step === 4 && (
                    <>
                        <Text style={styles.label}>Seus dados</Text>
                        <TextInput style={styles.input} placeholder="Nome completo" value={nome} onChangeText={setNome} />
                        <TextInput style={styles.input} placeholder="Telefone" value={telefone} onChangeText={setTelefone} keyboardType="phone-pad" />
                        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
                        <Text style={styles.label}>Nome do pet</Text>
                        <TextInput style={styles.input} placeholder="Nome do pet" value={petNome} onChangeText={setPetNome} />
                        <TextInput style={styles.input} placeholder="Observações (opcional)" value={petObservacoes} onChangeText={setPetObservacoes} />
                        <TouchableOpacity style={[styles.botao, { opacity: podeAvancarCadastro ? 1 : 0.5 }]} disabled={!podeAvancarCadastro} onPress={() => setStep(5)}>
                            <Text style={styles.botaoTexto}>Avançar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botao, { backgroundColor: "#aaa", marginTop: 10 }]} onPress={() => setStep(3)}>
                            <Text style={styles.botaoTexto}>Voltar</Text>
                        </TouchableOpacity>
                    </>
                )}
                {/* Step 5: Resumo */}
                {step === 5 && (
                    <>
                        <Text style={styles.label}>Resumo do agendamento</Text>
                        <View style={styles.resumoBox}>
                            <Text>Serviço: {servicos.find(s => s.idServico === servicoSelecionado)?.descricao}</Text>
                            <Text>Porte: {porteSelecionado === "1" ? "Pequeno" : porteSelecionado === "2" ? "Médio" : "Grande"}</Text>
                            <Text>Data: {Object.keys(datasSelecionadas)[0]}</Text>
                            <Text>Horário: {horarioSelecionado}</Text>
                            <Text>Nome: {nome}</Text>
                            <Text>Telefone: {telefone}</Text>
                            <Text>Email: {email}</Text>
                            <Text>Pet: {petNome}</Text>
                            {petObservacoes ? <Text>Observações: {petObservacoes}</Text> : null}
                        </View>
                        <TouchableOpacity style={styles.botao} onPress={confirmarAgendamento}>
                            <Text style={styles.botaoTexto}>Confirmar agendamento</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.botao, { backgroundColor: "#aaa", marginTop: 10 }]} onPress={() => setStep(4)}>
                            <Text style={styles.botaoTexto}>Voltar</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
        backgroundColor: "#F9F9F9",
    },
    centered: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F9F9F9",
        padding: 24,
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#4F46E5",
        marginBottom: 24,
        textAlign: "center",
    },
    botao: {
        backgroundColor: "#4F46E5",
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 10,
        marginTop: 20,
        alignItems: "center",
    },
    botaoTexto: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    label: {
        fontSize: 16,
        fontWeight: "600",
        marginVertical: 10,
        color: "#4F46E5",
    },
    porteBtn: {
        borderWidth: 1,
        borderColor: "#4F46E5",
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 18,
        marginHorizontal: 6,
        backgroundColor: "#fff",
    },
    porteBtnSel: {
        backgroundColor: "#4F46E5",
        borderColor: "#4F46E5",
    },
    horarioBox: {
        borderWidth: 1,
        borderColor: "#4F46E5",
        borderRadius: 8,
        padding: 12,
        margin: 6,
        backgroundColor: "#fff",
        minWidth: 80,
        alignItems: "center",
    },
    horarioSelecionado: {
        backgroundColor: "#4F46E5",
        borderColor: "#4F46E5",
    },
    input: {
        backgroundColor: "#fff",
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ddd",
        fontSize: 16,
        paddingHorizontal: 15,
        marginBottom: 10,
        height: 50,
        width: 260,
    },
    resumoBox: {
        backgroundColor: "#f7faff",
        borderRadius: 14,
        padding: 18,
        marginVertical: 16,
        borderWidth: 1,
        borderColor: "#e0e8f0",
    },
    modalSheet: {
        backgroundColor: "#fff",
        borderTopLeftRadius: 16,
        borderTopRightRadius: 16,
        paddingTop: 18,
        paddingHorizontal: 16,
        paddingBottom: 0,
        minHeight: "40%",
        maxHeight: "60%",
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,
    },
});

export default AgendamentoLink;
