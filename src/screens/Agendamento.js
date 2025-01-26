import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Switch,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Calendar } from "react-native-calendars";

const Agendamento = ({ navigation }) => {
    const [isPacoteMensal, setIsPacoteMensal] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState([]);
    const [horariosSelecionados, setHorariosSelecionados] = useState([]);
    const horariosPorData = {
        "2025-01-25": ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
        "2025-01-26": ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
        "2025-01-27": ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
        "2025-01-28": ["08:00", "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00"],
    };
    const services = [
        { id: '1', name: 'Banho', price: 'R$ 50,00' },
        { id: '2', name: 'Tosa', price: 'R$ 40,00' },
        { id: '3', name: 'Banho e Tosa Completa', price: 'R$ 120,00' },
        { id: '4', name: 'Banho e Tosa Higiênica', price: 'R$ 90,00' },
    ];
    const [petSelecionado, setPetSelecionado] = useState(null);
    const pets = [
        { id: "1", nome: "Bolt", imagem: "https://love.doghero.com.br/wp-content/uploads/2018/12/golden-retriever-1.png" },
        { id: "2", nome: "Luna", imagem: "https://ufape.com.br/wp-content/uploads/2024/03/Ufape-Hospital-Veterinario-cachorro-braquicefalico-GS2-MKT-Freepik.jpg" },
        { id: "3", nome: "Max", imagem: "https://ufape.com.br/wp-content/uploads/2024/11/Ufape-Hospital-Veterinario-Chihuahua-posando-em-um-fundo-laranja-como-parte-das-racas-de-cachorro-pequeno-GS2-MKT-Freepik.jpg" },
    ];
    const selecionarData = (data) => {
        setDataSelecionada(data);
        setHorariosDisponiveis(horariosPorData[data] || []);
        setHorariosSelecionados([]); // Reseta os horários selecionados ao mudar de data
    };
    const handleSelectService = (serviceId) => {
        setSelectedService(serviceId === selectedService ? null : serviceId);
    };
    const selecionarPet = (petId) => {
        setPetSelecionado(petId);
    };
    const toggleSwitch = () => {
        setIsPacoteMensal((prev) => !prev);
    };

    const selecionarHorario = (horario) => {
        setHorariosSelecionados((prev) =>
            prev.includes(horario)
                ? prev.filter((item) => item !== horario)
                : [...prev, horario]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-back" size={30} color="#000" style={styles.iconBackButton} />
                </TouchableOpacity>
                <Text style={styles.title}>Agendamento</Text>
            </View>
            <Image
                source={require('../../assets/loja1.png')}
                style={styles.image}
                resizeMode="contain"
            />
            <FlatList
                style={styles.scrollContainer}
                ListHeaderComponent={
                    <>
                        <View style={styles.switchContainer}>
                            <Text style={styles.subtitle}>Tipo do agendamento:</Text>
                            <Text style={styles.subtitle}>
                                {isPacoteMensal ? 'Pacote mensal' : 'Avulso'}
                            </Text>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={isPacoteMensal ? '#007aff' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={toggleSwitch}
                                value={isPacoteMensal}
                            />
                        </View>
                        <Text style={styles.subtitle}>Escolha serviço:</Text>
                    </>
                }
                data={services}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        onPress={() => handleSelectService(item.id)}
                        style={[
                            styles.serviceItem,
                            selectedService === item.id && styles.selectedService,
                        ]}
                    >
                        <Text style={styles.serviceName}>{item.name}</Text>
                        <Text style={styles.servicePrice}>{item.price}</Text>
                    </TouchableOpacity>
                )}
                ListFooterComponent={
                    <>
                        <Text style={styles.subtitle}>Selecione data:</Text>
                        <Calendar
                            onDayPress={(day) => selecionarData(day.dateString)}
                            markedDates={{
                                [dataSelecionada]: {
                                    selected: true,
                                    selectedColor: "#81b0ff",
                                },
                            }}
                            theme={{
                                todayTextColor: "#81b0ff",
                                selectedDayBackgroundColor: "#81b0ff",
                            }}
                        />
                        {dataSelecionada && (
                            <>
                                <Text style={styles.subtitle}>
                                    Horários disponíveis:
                                </Text>
                                <FlatList
                                    data={horariosDisponiveis}
                                    keyExtractor={(item) => item}
                                    renderItem={({ item }) => (
                                        <TouchableOpacity
                                            style={[
                                                styles.horarioItem,
                                                horariosSelecionados.includes(item) &&
                                                styles.horarioItemSelecionado,
                                            ]}
                                            onPress={() => selecionarHorario(item)}
                                        >
                                            <Text
                                                style={[
                                                    styles.horarioText,
                                                    horariosSelecionados.includes(item) &&
                                                    styles.horarioTextSelecionado,
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
                        {pets.length > 2 && (<View>
                            <Text style={styles.subtitle}>Qual pet irá realizar o agendamento?:</Text>
                            <FlatList
                                data={pets}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity
                                        style={[
                                            styles.petItem,
                                            petSelecionado === item.id && styles.petItemSelecionado,
                                        ]}
                                        onPress={() => selecionarPet(item.id)}
                                    >
                                        <View style={styles.petGroup}>
                                            <Image
                                                source={{ uri: item.imagem }}
                                                style={styles.petImage}
                                            />
                                            <Text style={styles.petName}>{item.nome}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )}
                                horizontal
                                nestedScrollEnabled
                            />
                        </View>
                        )}

                        <TouchableOpacity style={styles.confirmButton}>
                            <Text style={styles.confirmButtonText}>Confirmar agendamento</Text>
                        </TouchableOpacity>
                    </>
                }
            />
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    confirmButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20,
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    //cabeçalho
    header: {
        marginTop: '10%',
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: 1,
    },
    image: {
        width: '100%',
        height: 276,
    },
    title: {
        alignItems: 'center',
        left: '25%',
        fontSize: 20,
        fontWeight: 'bold',
    },
    iconBackButton: {
        position: 'absolute',
    },
    backButton: {
        flexDirection: 'column',
        width: 30,
    },
    //corpo
    scrollContainer: {
        padding: 10
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
    },
    selectedService: {
        backgroundColor: '#81b0ff',
    },
    serviceItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 15,
        backgroundColor: '#F9F9F9',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#EEEEEE',
        marginBottom: 10,
    },
    serviceName: {
        fontSize: 16,
        color: '#000000',
    },
    servicePrice: {
        fontSize: 16,
        color: '#28A745',
        fontWeight: '600',
    },
    horarioItem: {
        padding: 15,
        marginHorizontal: 8,
        borderRadius: 8,
        backgroundColor: "#e0e0e0",
        alignItems: "center"
    },
    horarioItemSelecionado: { backgroundColor: "#81b0ff" },
    horarioText: { fontSize: 16, color: "#000" },
    horarioTextSelecionado: { color: "#fff" },
    petItem: {
        flexDirection: "row",
        alignItems: "center",
        marginHorizontal: 10,
        padding: 10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#ccc",
        backgroundColor: "#f9f9f9",
    },
    petImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    petName: {
        fontSize: 16,
        fontWeight: "bold",
        textAlign: "center", // Centraliza o texto
    },
    petItemSelecionado: {
        backgroundColor: "#81b0ff",
        borderColor: "#007bff",
    },
    petGroup: {
        flexDirection: "row", // Organiza a imagem e o texto em coluna
        alignItems: "center",   // Centraliza os itens horizontalmente
    },

});

export default Agendamento;
