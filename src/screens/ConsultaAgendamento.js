import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput } from 'react-native';

const agendamentos = [
    { id: '1', pet: 'Rex', petshop: 'PetShop A', data: '2025-01-10', servico: 'Banho', valor: 'R$ 50' },
    { id: '2', pet: 'Miau', petshop: 'PetShop B', data: '2025-01-12', servico: 'Tosa', valor: 'R$ 40' },
];

export default function TelaConsulta() {
    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Consulta de Agendamentos</Text>
            <TextInput
                style={styles.input}
                placeholder="Filtrar por pet ou data"
            />
            <FlatList
                data={agendamentos}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text>{`Pet: ${item.pet}`}</Text>
                        <Text>{`PetShop: ${item.petshop}`}</Text>
                        <Text>{`Data: ${item.data}`}</Text>
                        <Text>{`Serviço: ${item.servico}`}</Text>
                        <Text>{`Valor: ${item.valor}`}</Text>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
    item: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
});
