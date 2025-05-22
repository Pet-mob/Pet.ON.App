import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView
} from 'react-native';
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
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Privacidade</Text>
            </View>

            <ScrollView contentContainerStyle={styles.bodyContainer} keyboardShouldPersistTaps="handled">
                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Senha Atual:</Text>
                    <TextInput
                        style={styles.input}
                        value={senhaAtual}
                        onChangeText={setSenhaAtual}
                        placeholder="Digite sua senha atual"
                        secureTextEntry
                        placeholderTextColor="#999"
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
                        placeholderTextColor="#999"
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
                        placeholderTextColor="#999"
                    />
                </View>

                <TouchableOpacity style={styles.botaoSalvar} onPress={alterarSenha}>
                    <Text style={styles.textoBotao}>Salvar</Text>
                </TouchableOpacity>
            </ScrollView>
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
    inputContainer: {
        marginBottom: 15,
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
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    textoBotao: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Privacidade;
