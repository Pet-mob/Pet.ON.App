import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Image } from 'react-native';

export default function TelaUsuario() {
    const [dadosTutor, setDadosTutor] = useState({
        nome: '', email: '', telefone: '', senha: ''
    });

    const [dadosPet, setDadosPet] = useState({
        nome: '', raca: '', tipo: '', idade: '', sexo: '', observacao: ''
    });

    return (
        <View style={styles.container}>
            <Text style={styles.titulo}>Dados do Tutor</Text>
            <Image style={styles.image} source={{ uri: 'https://via.placeholder.com/150' }} />
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={dadosTutor.nome}
                onChangeText={(text) => setDadosTutor({ ...dadosTutor, nome: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={dadosTutor.email}
                onChangeText={(text) => setDadosTutor({ ...dadosTutor, email: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Telefone"
                keyboardType="phone-pad"
                value={dadosTutor.telefone}
                onChangeText={(text) => setDadosTutor({ ...dadosTutor, telefone: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Senha"
                secureTextEntry
                value={dadosTutor.senha}
                onChangeText={(text) => setDadosTutor({ ...dadosTutor, senha: text })}
            />

            <Text style={styles.titulo}>Dados do Pet</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome"
                value={dadosPet.nome}
                onChangeText={(text) => setDadosPet({ ...dadosPet, nome: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Raça"
                value={dadosPet.raca}
                onChangeText={(text) => setDadosPet({ ...dadosPet, raca: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Tipo (Cachorro/Gato)"
                value={dadosPet.tipo}
                onChangeText={(text) => setDadosPet({ ...dadosPet, tipo: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Idade"
                keyboardType="numeric"
                value={dadosPet.idade}
                onChangeText={(text) => setDadosPet({ ...dadosPet, idade: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Sexo"
                value={dadosPet.sexo}
                onChangeText={(text) => setDadosPet({ ...dadosPet, sexo: text })}
            />
            <TextInput
                style={styles.input}
                placeholder="Observação"
                value={dadosPet.observacao}
                onChangeText={(text) => setDadosPet({ ...dadosPet, observacao: text })}
            />
            <Button title="Salvar Dados" onPress={() => { }} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    titulo: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 15, borderRadius: 5 },
    image: { width: 150, height: 150, borderRadius: 75, alignSelf: 'center', marginBottom: 20 },
});
