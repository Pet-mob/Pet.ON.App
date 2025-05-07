import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import apiRequisicaoUsuario from '../Service/apiRequisicaoUsuario.js';
import { getUsuarioStore } from '../store/store';

const DadosContas = () => {
    const [loading, setLoading] = useState(true);
    const [nome, setNome] = useState('');
    const [telefone, setTelefone] = useState('');
    const [foto, setFoto] = useState(null);
    const navigation = useNavigation();

    const usuarioStore = getUsuarioStore();
    const idUsuario = usuarioStore.id;
    const nomeUsuario = usuarioStore.nome;
    const telefoneUsuario = usuarioStore.telefone;

    const selecionarFoto = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para alterar a foto.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    const alterarUsuario = async () => {
        if (!nome || !telefone) {
            alert('Por favor, preencha nome e telefone.');
            return;
        }

        try {
            const sucesso = await apiRequisicaoUsuario.alterarUsuario(idUsuario, nome, telefone);
            if (sucesso) {
                alert('Usuario alterado com sucesso!');
                navigation.navigate('Usuario');
            } else {
                alert('Falha ao alterar o usuario.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao tentar alterar usuario.');
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            setNome(nomeUsuario);
            setTelefone(telefoneUsuario);
            // setFoto(null);
            setLoading(false);
        };

        carregarDados();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Usuario")}>
                    <Ionicons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Dados da Conta</Text>
            </View>

            <View style={styles.bodyContainer}>
                <TouchableOpacity style={styles.fotoContainer} onPress={selecionarFoto}>
                    <Image
                        source={foto ? { uri: foto } : require('../../assets/LogoPetON.png')}
                        style={styles.foto}
                    />
                    <Text style={styles.textoFoto}>Alterar Foto</Text>
                </TouchableOpacity>


                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome:</Text>
                    <TextInput
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite seu nome"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Telefone:</Text>
                    <TextInput
                        style={styles.input}
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="Digite seu telefone"
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity style={styles.botaoSalvar} onPress={alterarUsuario}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    //cabecalho
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
    //corpo
    bodyContainer: {
        padding: 10,
    },
    fotoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    foto: {
        width: 150,
        height: 150,
        borderRadius: 70,
        backgroundColor: '#e0e0e0',
    },
    textoFoto: {
        color: '#007bff',
        marginTop: 10,
    },
    inputContainer: {
        marginBottom: 15,
    },
    label: {
        fontSize: 16,
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        backgroundColor: '#F9F9F9',
    },
    botaoSalvar: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginVertical: 20
    },
    textoBotao: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default DadosContas;
