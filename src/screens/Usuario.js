import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { getUsuarioStore } from '../store/store';

const Usuario = () => {
    const navigation = useNavigation();
    const usuarioStore = getUsuarioStore();
    const nomeUsuario = usuarioStore.nome;

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('Principal')}>
                    <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>{nomeUsuario}</Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Conta</Text>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('DadosConta')}
                >
                    <Text style={styles.cardText}>Dados da Conta</Text>
                    <Ionicons name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('Privacidade')}
                >
                    <Text style={styles.cardText}>Privacidade</Text>
                    <Ionicons name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Pets</Text>
                <TouchableOpacity
                    style={styles.card}
                    onPress={() => navigation.navigate('DadosPets')}
                >
                    <Text style={styles.cardText}>Dados dos Pets</Text>
                    <Ionicons name="chevron-forward" size={20} color="#888" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    // container: {
    // },
    // header: {
    // },
    // backButton: {
    // },
    // title: {
    // },

    container: {
        flex: 1,
        backgroundColor: '#F9F9F9',
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#4F46E5',
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        // flexDirection: 'row',
        // alignItems: 'center',
        // paddingTop: 50,
        // paddingBottom: 15,
        // paddingHorizontal: 20,
        // backgroundColor: '#FFF',
        // elevation: 4,
        // borderBottomWidth: 1,
        // borderColor: '#E0E0E0',
    },
    backButton: {
        position: "absolute",
        left: 16,
        top: 50,
        // padding: 10,
        // position: 'absolute',
        // left: 20,
        // top: 50,
        // padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
        // flex: 1,
        // textAlign: 'center',
        // fontSize: 20,
        // fontWeight: 'bold',
        // color: '#333',
    },
    scrollContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    },
    card: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.05,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
});

export default Usuario;
