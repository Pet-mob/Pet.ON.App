import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Image, Alert, Platform } from 'react-native';
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
        if (Platform.OS === 'web') {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = async (event) => {
                const file = event.target.files[0];
                if (file) {
                    try {
                        const resposta = await apiRequisicaoUsuario.enviarFotoUsuario(file, idUsuario);
                        setFoto(resposta);
                    } catch (error) {
                        console.error('Erro ao enviar foto do usuário:', error);
                    }
                }
            };
            input.click();
        } else {
            const resultado = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                quality: 1,
            });

            if (!resultado.canceled && resultado.assets?.length > 0) {
                const imagem = resultado.assets[0];
                try {
                    const resposta = await apiRequisicaoUsuario.enviarFotoUsuario(imagem, idUsuario);
                    setFoto(resposta);
                } catch (error) {
                    console.error('Erro ao enviar foto do usuário:', error);
                }
            }
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
                alert('Usuário alterado com sucesso!');
                navigation.navigate('Usuario');
            } else {
                alert('Falha ao alterar o usuário.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao tentar alterar o usuário.');
        }
    };

    const carregarFoto = async () => {
        try {
            const resposta = await apiRequisicaoUsuario.buscarFotoUsuario(idUsuario);
            if (resposta) {
                setFoto(resposta[0].url);
            }
        } catch (error) {
            console.error('Erro ao carregar foto:', error);
        }
    };

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            setNome(nomeUsuario);
            setTelefone(telefoneUsuario);
            await carregarFoto();
            setLoading(false);
        };

        carregarDados();
    }, []);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Usuario")}>
                    <Ionicons name="arrow-back" size={28} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Dados da Conta</Text>
            </View>

            <View style={styles.bodyContainer}>
                <TouchableOpacity style={styles.fotoContainer} onPress={selecionarFoto}>
                    <Image
                        source={foto ? { uri: foto } : { uri: "https://azureblobpeton.blob.core.windows.net/fotos-usuarios/usuario.png?sp=r&st=2025-05-14T01:03:49Z&se=2026-05-13T09:03:49Z&spr=https&sv=2024-11-04&sr=b&sig=d%2B%2BtxK1dMnSh%2FdHeCitA%2BrbR%2BnGq7FkRh3cd5Gg1AEQ%3D" }}
                        style={styles.foto}
                    />
                    <Text style={styles.textoFoto}>Alterar Foto</Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome</Text>
                    <TextInput
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite seu nome"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Telefone</Text>
                    <TextInput
                        style={styles.input}
                        value={telefone}
                        onChangeText={setTelefone}
                        placeholder="Digite seu telefone"
                        keyboardType="phone-pad"
                    />
                </View>

                <TouchableOpacity style={styles.botaoSalvar} onPress={alterarUsuario}>
                    <Text style={styles.textoBotao}>Salvar Alterações</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
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
    },
    backButton: {
        position: "absolute",
        left: 16,
        top: 50,
        // padding: 10,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
        color: "#FFFFFF",
    },
    bodyContainer: {
        padding: 20,
    },
    fotoContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    foto: {
        width: 140,
        height: 140,
        borderRadius: 70,
        backgroundColor: '#e0e0e0',
    },
    textoFoto: {
        color: '#007bff',
        marginTop: 10,
        fontSize: 16,
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#555',
        marginBottom: 6,
    },
    input: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 12,
        borderWidth: 1,
        borderColor: '#ddd',
        fontSize: 16,
    },
    botaoSalvar: {
        backgroundColor: '#28a745',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 3,
    },
    textoBotao: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    }
});

export default DadosContas;
