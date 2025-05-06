import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import apiRequisicaoUsuario from '../Service/apiRequisicaoUsuario.js';
import { getUsuarioStore } from '../store/store';
const Privacidade = () => {
    const [senhaAtual, setSenhaAtual] = useState('');
    const [novaSenha, setNovaSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');
    const navigation = useNavigation();
    const usuarioStore = getUsuarioStore();
    const idUsuario = usuarioStore.id;

    const alterarSenha = async () => {
        if (!senhaAtual || !novaSenha || !confirmarSenha) {
            alert('Por favor, preencha todos os campos.');
            return;
        }

        if (novaSenha !== confirmarSenha) {
            alert('As senhas não coincidem.');
            return;
        }

        try {
            const sucesso = await apiRequisicaoUsuario.alterarSenhaUsuario(novaSenha, idUsuario);
            if (sucesso) {
                alert('Senha alterada com sucesso!');
                navigation.navigate('Usuario');
            } else {
                alert('Falha ao alterar a senha. Verifique a senha atual.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao tentar alterar a senha.');
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Usuario")}>
                    <Ionicons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Dados da Conta</Text>
            </View>

            <View style={styles.bodyContainer}>
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha Atual:</Text>
                    <TextInput
                        style={styles.input}
                        value={senhaAtual}
                        onChangeText={setSenhaAtual}
                        placeholder="Digite sua senha atual"
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nova Senha:</Text>
                    <TextInput
                        style={styles.input}
                        value={novaSenha}
                        onChangeText={setNovaSenha}
                        placeholder="Digite a nova senha"
                        secureTextEntry
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Confirmar Nova Senha:</Text>
                    <TextInput
                        style={styles.input}
                        value={confirmarSenha}
                        onChangeText={setConfirmarSenha}
                        placeholder="Confirme a nova senha"
                        secureTextEntry
                    />
                </View>

                <TouchableOpacity style={styles.botaoSalvar} onPress={alterarSenha}>
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
    header: {
        paddingTop: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        padding: 15,
        elevation: 9,
        position: "relative",
        borderBottomWidth: 1
    },
    backButton: {
        paddingTop: 50,
        padding: 15,
        position: "absolute",
        left: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    bodyContainer: {
        padding: 10,
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

export default Privacidade;
