import React from 'react';
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
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TelaLogin = () => {
    const navigation = useNavigation(); // Hook para navegação

    const handleLogin = () => {
        // Redireciona para a tela "Principal"
        navigation.navigate('Principal');
    };
    return (
        <KeyboardAvoidingView
            style={estilos.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={estilos.containerInterno}>
                    {/* Logotipo */}
                    <View style={estilos.containerLogo}>
                        <Image
                            source={require('../../assets/LogoPetON.png')}
                            style={estilos.logo}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Texto de boas-vindas */}
                    <Text style={estilos.textoBoasVindas}>Bem-vindo</Text>

                    {/* Campos de entrada */}
                    <TextInput
                        style={estilos.input}
                        placeholder="Digite seu celular"
                        keyboardType="phone-pad"
                        placeholderTextColor="#aaa"
                    />
                    <TextInput
                        style={estilos.input}
                        placeholder="Digite sua senha"
                        secureTextEntry
                        placeholderTextColor="#aaa"
                    />

                    {/* Botão de login */}
                    <TouchableOpacity style={estilos.botao} onPress={handleLogin}>
                        <Text style={estilos.textoBotao}>Entrar</Text>
                    </TouchableOpacity>

                    {/* Links */}
                    <View style={estilos.containerLinks}>
                        <TouchableOpacity>
                            <Text style={estilos.link}>Esqueceu a senha?</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
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
        backgroundColor: '#F5F5F5',
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
        width: 200,
        height: 200,
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
        backgroundColor: '#fff',
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
