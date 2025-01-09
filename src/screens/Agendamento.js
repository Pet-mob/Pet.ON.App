import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button, Picker } from 'react-native';

const servicos = [
    { id: '1', nome: 'Banho', preco: 'R$ 50' },
    { id: '2', nome: 'Tosa', preco: 'R$ 40' },
];

const pets = [
    { id: '1', nome: 'Rex' },
    { id: '2', nome: 'Miau' },
];

export default function TelaAgendamento() {
    const [petSelecionado, setPetSelecionado] = useState('');

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>PetShop A</Text>
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
            <Picker
                selectedValue={petSelecionado}
                onValueChange={(itemValue) => setPetSelecionado(itemValue)}
                style={styles.picker}
            >
                {pets.map((pet) => (
                    <Picker.Item key={pet.id} label={pet.nome} value={pet.id} />
                ))}
            </Picker>
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
