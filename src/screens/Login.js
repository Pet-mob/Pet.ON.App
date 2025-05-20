import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { setUsuarioStore } from '../store/store';
import apiRequisicaoUsuario from '../Service/apiRequisicaoUsuario.js';

const TelaLogin = () => {
    const navigation = useNavigation();
    const [Telefone, setTelefone] = useState('');
    const [Senha, setSenha] = useState('');
    const [loading, setLoading] = useState(false); // <- NOVO

    const handleLogin = async () => {
        if (!Telefone || !Senha) {
            alert('Preencha todos os campos!');
            return;
        }
        setLoading(true); // <- INICIA LOADING
        try {
            const resposta = await apiRequisicaoUsuario.validarLogin(Telefone, Senha);

            if (resposta.loginAtivado) {
                setUsuarioStore(resposta.buscarUsuarioResDto);
                navigation.navigate('Principal');
            } else {
                alert('Credenciais inválidas...');
            }
        } catch (error) {
            alert('Erro ao buscar usuário');
            // console.log(error);
        } finally {
            setLoading(false); // <- FINALIZA LOADING
        }
    };

    const redirecionarParaRegistraNovoUsuario = () => {
        navigation.navigate('RegistrarNovoUsuario');
    }

    const handleEsqueceuSenha = () => {
        navigation.navigate('EsqueceuSenha');
    };

    return (
        <KeyboardAvoidingView
            style={estilos.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={estilos.containerInterno}>
                    <View style={estilos.containerLogo}>
                        <Image
                            source={require('../../assets/LogoPetON.png')}
                            style={estilos.logo}
                            resizeMode="contain"
                        />
                    </View>

                    <Text style={estilos.textoBoasVindas}>Bem-vindo</Text>

                    <TextInput
                        style={estilos.input}
                        placeholder="Digite seu celular"
                        value={Telefone}
                        onChangeText={setTelefone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        style={estilos.input}
                        placeholder="Digite sua senha"
                        value={Senha}
                        onChangeText={setSenha}
                        secureTextEntry
                        placeholderTextColor="#aaa"
                    />

                    <TouchableOpacity
                        style={[estilos.botao, loading && { backgroundColor: '#aaa' }]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator size="small" color="#FFF" />
                        ) : (
                            <Text style={estilos.textoBotao}>Entrar</Text>
                        )}
                    </TouchableOpacity>

                    <View style={estilos.containerLinks}>
                        <TouchableOpacity style={estilos.link} onPress={handleEsqueceuSenha}>
                            <Text style={estilos.link}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={redirecionarParaRegistraNovoUsuario}>
                            <Text style={estilos.link}>Registrar-se</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

const estilos = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    containerInterno: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    containerLogo: {
        marginBottom: 20,
        alignItems: 'center',
    },
    logo: {
        width: 230,
        height: 230,
    },
    textoBoasVindas: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: '#F9F9F9',
        fontSize: 16,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 2, // Para Android
    },
    botao: {
        width: '100%',
        height: 50,
        backgroundColor: '#28A745',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    textoBotao: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    containerLinks: {
        marginTop: 10,
        alignItems: 'center',
    },
    link: {
        color: '#007BFF',
        fontSize: 14,
        textAlign: 'center',
        marginVertical: 5,
    },
});

export default TelaLogin;
