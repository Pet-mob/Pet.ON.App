import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';


const Agendamento = ({ route, navigation }) => {
    const [selectedDate, setSelectedDate] = useState('29/12/2024 às 14:12:31');

    const services = [
        { id: '1', name: 'Banho', price: 'R$ 50,00' },
        { id: '2', name: 'Tosa', price: 'R$ 40,00' },
        { id: '3', name: 'Consulta Veterinária', price: 'R$ 120,00' },
        { id: '4', name: 'Vacinação', price: 'R$ 90,00' },
    ];

    return (
        <View style={styles.container}>
            {/* Imagem superior */}
            <Image
                source={require('../../assets/loja1.png')} // Substitua pela URL da imagem ou use require()
                style={styles.headerImage}
                resizeMode="contain"
            />
            <View style={styles.containerBody}>
                {/* Cabeçalho com o botão de voltar e o título */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="arrow-back" size={24} color="#000" />
                    </TouchableOpacity>
                    <Text style={styles.title}>Agendar</Text>
                </View>
                {/* Lista de serviços */}
                <Text style={styles.subtitle}>Escolha um Serviço</Text>
                <FlatList
                    data={services}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.serviceItem}>
                            <Text style={styles.serviceName}>{item.name}</Text>
                            <Text style={styles.servicePrice}>{item.price}</Text>
                        </View>
                    )}
                />

                {/* Escolha de data e hora */}
                <Text style={styles.subtitle}>Escolha a Data e Hora</Text>
                <TextInput
                    style={styles.dateInput}
                    value={selectedDate}
                    onChangeText={setSelectedDate}
                />

                {/* Botão de confirmação */}
                <TouchableOpacity style={styles.confirmButton}>
                    <Text style={styles.confirmButtonText}>Confirmar Agendamento</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
    },
    containerBody: {
        borderTopWidth: 1,
        borderRightWidth: 1,
        borderLeftWidth: 1,
        borderRadius: 20,
        borderColor: '#CCCCCC',
        backgroundColor: '#FFFFFF',
        padding: 10,
    },
    headerImage: {
        width: 'auto',
        height: 276,
        marginTop: 10
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        fontWeight: '600',
        marginVertical: 10,
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
    dateInput: {
        height: 40,
        borderWidth: 1,
        borderColor: '#CCCCCC',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
        backgroundColor: '#F9F9F9',
    },
    confirmButton: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
    },
    confirmButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    backButton: {
        marginRight: 10,
    }
});

export default Agendamento;
