import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Button } from 'react-native';

export default function Login({ navigation }) {
    const [telefone, setTelefone] = useState('');
    const [senha, setSenha] = useState('');

    const handleLogin = () => {
        // Adicione validação de telefone e senha
        // Conexão com API para autenticação
        navigation.navigate('Principal');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.logo}>Pet.ON.App</Text>
            <TextInput
                style={styles.input}
                placeholder="Telefone"
                keyboardType="phone-pad"
                value={telefone}
                onChangeText={setTelefone}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={senha}
                onChangeText={setSenha}
            />
            <TouchableOpacity onPress={() => navigation.navigate('RecuperarSenha')}>
                <Text style={styles.link}>Esqueci a senha</Text>
            </TouchableOpacity>
            <Button title="Entrar" onPress={handleLogin} />
            <View style={styles.socialLogin}>
                <Button title="Logar com Facebook" onPress={() => { }} />
                <Button title="Logar com Gmail" onPress={() => { }} />
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Usuario')}>
                <Text style={styles.link}>Cadastrar-se</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
    logo: { fontSize: 28, fontWeight: 'bold', marginBottom: 30, textAlign: 'center' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
    link: { color: '#007BFF', textAlign: 'center', marginTop: 10 },
    socialLogin: { marginTop: 20 },
});
