import React, { useEffect, useState } from 'react';
import {
    View, Text, TouchableOpacity, StyleSheet, FlatList, Image, Switch, ActivityIndicator, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from 'react-native-calendars';
import { getUsuarioStore } from '../store/store';
import apiRequisicaoAgendamento from '../Service/apiRequisicaoAgendamento';
import apiRequisicaoAnimal from '../Service/apiRequisicaoAnimal';
import apiRequisicaoServico from '../Service/apiRequisicaoServico';

const Agendamento = ({ navigation, route }) => {
    const [loading, setLoading] = useState(true);
    const [confirmando, setConfirmando] = useState(false);

    const { idEmpresaPetShop } = route.params;
    const { id: idUsuario } = getUsuarioStore();

    const [servicos, setServicos] = useState([]);
    const [pets, setPets] = useState([]);
    const [petSelecionado, setPetSelecionado] = useState(null);
    const [servicoSelecionado, setServicoSelecionado] = useState(null);
    const [ehPacoteMensal, setEhPacoteMensal] = useState(false);

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
                apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(idUsuario)
            ]);

            if (servicosApi) setServicos(servicosApi);

            // Carregar fotos dos pets
            const fotos = await apiRequisicaoAnimal.buscarFotosAnimalPorUsuario(idUsuario);
            const petsComFoto = petsApi.map(pet => {
                const foto = fotos?.find(f => f.idAnimal === pet.idAnimal);
                return {
                    ...pet,
                    imagem: foto?.url || 'https://azureblobpeton.blob.core.windows.net/fotos-usuarios/usuario.png?sp=r&st=2025-05-14T01:03:49Z&se=2026-05-13T09:03:49Z&spr=https&sv=2024-11-04&sr=b&sig=d%2B%2BtxK1dMnSh%2FdHeCitA%2BrbR%2BnGq7FkRh3cd5Gg1AEQ%3D'
                };
            });
            setPets(petsComFoto);
            const dataHoje = new Date().toISOString().split('T')[0];
            selecionarData({ dateString: dataHoje });
        } catch (error) {
            Alert.alert('Erro', 'Erro ao carregar serviços ou pets.');
        } finally {
            setLoading(false);
        }
    };

    const selecionarData = async ({ dateString }) => {
        const hoje = new Date().toISOString().split('T')[0];
        if (dateString < hoje) {
            Alert.alert('Atenção', 'Não é possível selecionar uma data anterior a hoje.');
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
                Alert.alert('Atenção', 'Máximo de 4 datas para plano mensal.');
                return;
            }

            const conflito = datas.some(data => {
                const diff = Math.abs((new Date(dateString) - new Date(data)) / (1000 * 60 * 60 * 24));
                return diff < 7;
            });

            if (conflito) {
                Alert.alert('Atenção', 'Datas devem ter pelo menos 7 dias de diferença.');
                return;
            }

            const novasDatas = {
                ...datasSelecionadas,
                [dateString]: { selected: true, marked: true, selectedColor: '#81b0ff' },
            };
            setDatasSelecionadas(novasDatas);
            await buscarHorarios(Object.keys(novasDatas));
        } else {
            const novaData = {
                [dateString]: { selected: true, marked: true, selectedColor: '#81b0ff' }
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
        const servico = servicos.find(s => s.idServico === servicoSelecionado);
        if (!servico) return;

        const duracao = servico?.duracao || 120;

        setLoading(true);
        try {
            const { horarios } = await apiRequisicaoAgendamento.buscarHorariosDisponiveisNaApi(
                idEmpresaPetShop, datas, duracao
            );
            setHorariosDisponiveis(horarios || []);
            setHorariosSelecionados([]);
        } catch {
            Alert.alert('Erro', 'Erro ao buscar horários.');
        } finally {
            setLoading(false);
        }
    };

    const confirmarAgendamento = async () => {
        if (confirmando) return;
        if (!petSelecionado || !servicoSelecionado || horariosSelecionados.length === 0 || Object.keys(datasSelecionadas).length === 0) {
            Alert.alert('Atenção', 'Preencha todos os campos antes de confirmar o agendamento.');
            return;
        }

        setConfirmando(true);
        try {
            const servico = servicos.find(s => s.idServico === servicoSelecionado);
            const duracao = servico?.duracao || 120;

            const agendamentos = Object.keys(datasSelecionadas).flatMap(data => {
                return horariosSelecionados.map(horario => {
                    const [h, m] = horario.split(':');
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
                        horarioFinal: `${fim.getHours().toString().padStart(2, '0')}:${fim.getMinutes().toString().padStart(2, '0')}:00`,
                        status: 'Agendado'
                    };
                });
            });

            for (const dto of agendamentos) {
                await apiRequisicaoAgendamento.adicionarAgendamentoNaApi(dto);
            }

            Alert.alert('Sucesso', 'Agendamento realizado com sucesso!');
            navigation.goBack();
        } catch {
            Alert.alert('Erro', 'Erro ao confirmar agendamento.');
        } finally {
            setConfirmando(false);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Icon name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Agendamento</Text>
            </View>

            {loading ? <ActivityIndicator size="large" color="#007aff" /> : (
                <FlatList
                    style={styles.scrollContainer}
                    ListHeaderComponent={
                        <>
                            <View style={styles.switchContainer}>
                                <Text style={styles.label}>Tipo do agendamento:</Text>
                                <Text>{ehPacoteMensal ? 'Plano mensal' : 'Único'}</Text>
                                <Switch
                                    value={ehPacoteMensal}
                                    onValueChange={() => {
                                        setEhPacoteMensal(v => !v);
                                        setDatasSelecionadas({});
                                        setHorariosSelecionados([]);
                                    }}
                                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                                    thumbColor={ehPacoteMensal ? '#007aff' : '#f4f3f4'}
                                />
                            </View>

                            <Text style={styles.label}>Escolha serviço:</Text>
                        </>
                    }
                    data={servicos}
                    keyExtractor={item => String(item.idServico)}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[styles.itemBox, servicoSelecionado === item.idServico && styles.itemSelected]}
                            onPress={async () => {
                                const novoServico = servicoSelecionado === item.idServico ? null : item.idServico;
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
                    ListFooterComponent={
                        <>
                            <Text style={styles.label}>Selecione data:</Text>
                            <Calendar
                                markedDates={datasSelecionadas}
                                onDayPress={selecionarData}
                                minDate={new Date().toISOString().split('T')[0]}
                            />

                            {horariosDisponiveis.length > 0 && (
                                <>
                                    <Text style={styles.label}>Horários disponíveis:</Text>
                                    <FlatList
                                        data={horariosDisponiveis}
                                        keyExtractor={item => item}
                                        horizontal
                                        renderItem={({ item }) => (
                                            <TouchableOpacity
                                                style={[styles.horarioBox, horariosSelecionados.includes(item) && styles.horarioSelecionado]}
                                                onPress={() => {
                                                    if (horariosSelecionados.includes(item)) {
                                                        setHorariosSelecionados(horariosSelecionados.filter(h => h !== item));
                                                    } else {
                                                        setHorariosSelecionados([...horariosSelecionados, item]);
                                                    }
                                                }}
                                            >
                                                <Text style={{ color: horariosSelecionados.includes(item) ? '#fff' : '#000' }}>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                </>
                            )}

                            <Text style={styles.label}>Escolha o pet:</Text>
                            <FlatList
                                data={pets}
                                keyExtractor={item => String(item.idAnimal)}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[styles.petBox, petSelecionado === item.idAnimal && styles.petSelecionado]}
                                        onPress={() => setPetSelecionado(item.idAnimal)}
                                    >
                                        <Image
                                            source={{ uri: item.imagem }}
                                            style={styles.petImage}
                                            resizeMode="cover"
                                        />
                                        <Text style={styles.petName}>{item.nome}</Text>
                                    </TouchableOpacity>
                                )}
                            />

                            <TouchableOpacity
                                style={styles.btnConfirmar}
                                onPress={confirmarAgendamento}
                                disabled={confirmando}
                            >
                                <Text style={styles.textBtnConfirmar}>
                                    {confirmando ? 'Confirmando...' : 'Confirmar Agendamento'}
                                </Text>
                            </TouchableOpacity>
                        </>
                    }
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff' },
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
    title: { fontSize: 20, fontWeight: 'bold', marginLeft: 10 },
    scrollContainer: { marginBottom: 20 },
    switchContainer: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15
    },
    label: { fontSize: 16, fontWeight: '600', marginVertical: 10 },
    itemBox: {
        padding: 15, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 10,
        flexDirection: 'row', justifyContent: 'space-between'
    },
    itemSelected: { backgroundColor: '#cce4ff', borderColor: '#007aff' },
    horarioBox: {
        padding: 10, marginRight: 10, borderRadius: 5, borderWidth: 1, borderColor: '#ccc'
    },
    horarioSelecionado: {
        backgroundColor: '#007aff', borderColor: '#005bb5'
    },
    petBox: {
        alignItems: 'center', marginRight: 15,
    },
    petSelecionado: {
        borderWidth: 2, borderColor: '#007aff', borderRadius: 50, padding: 2,
    },
    petImage: {
        width: 70, height: 70, borderRadius: 35,
    },
    petName: {
        marginTop: 5, fontSize: 14, maxWidth: 70, textAlign: 'center'
    },
    btnConfirmar: {
        backgroundColor: '#007aff', padding: 15, borderRadius: 6, marginTop: 20, alignItems: 'center',
    },
    textBtnConfirmar: {
        color: '#fff', fontWeight: 'bold', fontSize: 16,
    }
});

export default Agendamento;
