import React, { useState } from "react";
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    Image,
    ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";
import { Ionicons } from "@expo/vector-icons"; // Certifique-se de instalar: expo install @expo/vector-icons

const ConsultaAgendamento = ({ navigation }) => {
    const [petSelecionado, setPetSelecionado] = useState("");
    const [petShopSelecionado, setPetShopSelecionado] = useState("");
    const [dataSelecionada, setDataSelecionada] = useState(null);
    const [servicoSelecionado, setServicoSelecionado] = useState("");
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [filtrosVisiveis, setFiltrosVisiveis] = useState(false);

    const pets = [
        { id: "1", nome: "Bolt", imagem: "https://love.doghero.com.br/wp-content/uploads/2018/12/golden-retriever-1.png" },
        { id: "2", nome: "Luna", imagem: "https://ufape.com.br/wp-content/uploads/2024/03/Ufape-Hospital-Veterinario-cachorro-braquicefalico-GS2-MKT-Freepik.jpg" },
        { id: "3", nome: "Max", imagem: "https://ufape.com.br/wp-content/uploads/2024/11/Ufape-Hospital-Veterinario-Chihuahua-posando-em-um-fundo-laranja-como-parte-das-racas-de-cachorro-pequeno-GS2-MKT-Freepik.jpg" },
    ];

    const petShops = [
        { id: "1", nome: "Pet Shop Central" },
        { id: "2", nome: "Amigo do Pet" },
    ];

    const servicos = [
        { id: "1", nome: "Banho" },
        { id: "2", nome: "Tosa" },
        { id: "3", nome: "Consulta Veterinária" },
    ];

    const agendamentos = [
        {
            id: "1",
            pet: "Bolt",
            imagem: pets[0].imagem,
            petShop: "Pet Shop Central",
            servico: "Banho",
            data: "2025-01-28",
            horario: "11:00"
        },
        {
            id: "2",
            pet: "Luna",
            imagem: pets[1].imagem,
            petShop: "Amigo do Pet",
            servico: "Tosa",
            data: "2025-01-30",
            horario: "14:00"
        },
        {
            id: "3",
            pet: "Max",
            imagem: pets[2].imagem,
            petShop: "Pet Shop Central",
            servico: "Consulta Veterinária",
            data: "2025-01-29",
            horario: "17:00"
        },
    ];

    const filtrarAgendamentos = () => {
        return agendamentos.filter((agendamento) => {
            return (
                (!petSelecionado || agendamento.pet === petSelecionado) &&
                (!petShopSelecionado || agendamento.petShop === petShopSelecionado) &&
                (!servicoSelecionado || agendamento.servico === servicoSelecionado) &&
                (!dataSelecionada ||
                    agendamento.data === dataSelecionada.toISOString().split("T")[0])
            );
        });
    };

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Consulta de Agendamentos</Text>
            </View>

            {/* Lista de Agendamentos */}
            <FlatList
                data={filtrarAgendamentos()}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.agendamentoItem}>
                        <Image source={{ uri: item.imagem }} style={styles.petImage} />
                        <View>
                            <Text style={styles.agendamentoText}>Pet: {item.pet}</Text>
                            <Text style={styles.agendamentoText}>Serviço: {item.servico}</Text>
                            <Text style={styles.agendamentoText}>Estabelecimento: {item.petShop}
                            </Text>
                            <Text style={styles.agendamentoText}>Data: {item.data}</Text>
                            <Text style={styles.agendamentoText}>Horários: {item.horario}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    <Text style={styles.emptyText}>
                        Nenhum agendamento encontrado.
                    </Text>
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
    //cabeçalho
    header: {
        paddingTop: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Centraliza o conteúdo horizontalmente
        padding: 15,
        elevation: 9,
        position: "relative", // Para posicionar o botão "voltar"
        borderBottomWidth: 1
    },
    backButton: {
        paddingTop: 50,
        padding: 15,
        position: "absolute", // Deixa o botão "voltar" no canto esquerdo
        left: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    //lista de agendamentos
    filterButton: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#6200ee",
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    filterButtonText: {
        color: "#fff",
        marginLeft: 5,
    },
    filters: {
        paddingHorizontal: 15,
    },
    picker: {
        height: 50,
        backgroundColor: "#fff",
    },
    agendamentoItem: {
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
    petImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    agendamentoText: {
        fontSize: 16,
        color: '#000000',
    },
    emptyText: {
        textAlign: "center",
        fontSize: 16,
        marginTop: 20,
        color: '#000000',
    },
});

export default ConsultaAgendamento;
