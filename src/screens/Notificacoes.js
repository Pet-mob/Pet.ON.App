import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { api } from '../Service/api';
import { getUsuarioStore } from '../store/store';
import { useNavigation } from '@react-navigation/native';

const Notificacoes = () => {
    const [notificacoes, setNotificacoes] = useState([]);
    const usuario = getUsuarioStore();
    const navigation = useNavigation();

    useEffect(() => {
        carregarNotificacoes();
    }, []);

    const carregarNotificacoes = async () => {
        try {
            const response = await api.get(`/Notificacao/ListarNotificacoes/${usuario.id}`);
            setNotificacoes(response.data);
        } catch (error) {
            console.error('Erro ao carregar notificações:', error);
        }
    };

    const marcarComoLida = async (id) => {
        await api.post(`/Notificacao/MarcarComoLida/${id}`);
        carregarNotificacoes();
    };

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => marcarComoLida(item.id)} style={[styles.item, !item.lida && styles.naoLida]}>
            <Text style={styles.titulo}>{item.titulo}</Text>
            <Text style={styles.mensagem}>{item.mensagem}</Text>
            <Text style={styles.data}>{new Date(item.dataEnvio).toLocaleString()}</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={notificacoes}
                keyExtractor={item => item.id.toString()}
                renderItem={renderItem}
                ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Sem notificações</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 10 },
    item: {
        backgroundColor: '#f4f4f4',
        padding: 15,
        marginBottom: 10,
        borderRadius: 8,
    },
    naoLida: {
        borderColor: '#007bff',
        borderWidth: 1,
    },
    titulo: { fontWeight: 'bold', fontSize: 16 },
    mensagem: { fontSize: 14, marginTop: 4 },
    data: { fontSize: 12, color: '#666', marginTop: 6 },
});

export default Notificacoes;
