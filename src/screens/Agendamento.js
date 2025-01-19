import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

const Agendamento = ({ route }) => {
    // const [petSelecionado, setPetSelecionado] = useState('');
    const { idEmpresaPetShop } = route.params; // Captura o parâmetro

    const servicos = [
        { id: '1', nome: 'Banho', preco: 'R$ 50' },
        { id: '2', nome: 'Tosa', preco: 'R$ 40' },
    ];

    const pets = [
        { id: '1', nome: 'Rex' },
        { id: '2', nome: 'Miau' },
    ];

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>PetShop: {idEmpresaPetShop}</Text>
            <FlatList
                data={servicos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.servico}>
                        <Text>{item.nome}</Text>
                        <Text>{item.preco}</Text>
                    </View>
                )}
            />
            <RNPickerSelect
                onValueChange={(value) => setPetSelecionado(value)}
                items={pets.map((pet) => ({ label: pet.nome, value: pet.id }))}
            />
            <Button title="Agendar" onPress={() => { }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    servico: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
    picker: { marginVertical: 20 },
});

export default Agendamento;
