import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'; // Importando o KeyboardAwareScrollView
import { getUsuarioStore } from '../store/store';
import apiRequisicaoAnimal from '../Service/apiRequisicaoAnimal.js';

const DadosPets = () => {
    const [loading, setLoading] = useState(true);
    const [idAnimal, setIdAnimal] = useState('');
    const [nome, setNome] = useState('');
    const [idade, setIdade] = useState('');
    const [raca, setRaca] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const navigation = useNavigation();
    const [foto, setFoto] = useState(null);
    const usuarioStore = getUsuarioStore();
    const idUsuario = usuarioStore.id;
    const [listaDePets, setListaDePets] = useState("");

    const buscarPetsPorUsuario = async (idUsuarioParam) => {
        try {
            const resposta = await apiRequisicaoAnimal.buscarAnimalUsuarioNaApi(idUsuarioParam);
            if (resposta) {
                setListaDePets(resposta);
            } else {
                alert("Não há dados cadastrado.");
            }
        } catch (error) {
            alert('Erro ao carregar dados dos listaDePets');
        }
    };

    const alterarPet = async () => {
        try {
            const sucesso = await apiRequisicaoAnimal.alterarUsuario(idAnimal, nome, idade, raca, observacoes, idUsuario);
            if (sucesso) {
                alert('Pet alterado com sucesso!');
                navigation.navigate('Usuario');
            } else {
                alert('Falha ao alterar o pet.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao tentar alterar pet.');
        }
    };

    const inserirPet = async () => {
        try {
            const sucesso = await apiRequisicaoAnimal.inserirAnimal(nome, idade, raca, observacoes, idUsuario);
            if (sucesso) {
                alert('pet inserido com sucesso!');
                navigation.navigate('Usuario');
            } else {
                alert('Falha ao inseir o pet.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao tentar inserir pet.');
        }
    };

    const excluirPetApi = async (idUsuarioParam, idAnimalParam) => {
        try {
            const sucesso = await apiRequisicaoAnimal.excluirAnimal(idUsuarioParam, idAnimalParam);
            if (sucesso) {
                alert('pet excluido com sucesso!');
                navigation.navigate('Usuario');
            } else {
                alert('Falha ao excluir o pet.');
            }
        } catch (error) {
            console.error(error);
            alert('Ocorreu um erro ao tentar excluir pet.');
        }
    };

    const addPet = () => {
        if (nome && idade && raca) {
            setPets([...listaDePets, { id: Date.now(), name: nome, age: idade, breed: raca, notes: observacoes, photo: foto }]);
            setNome('');
            setIdade('');
            setRaca('');
            setObservacoes('');
            setFoto(null);
        }
    };

    const processoExcluirPet = async (idAnimal) => {
        setPets((prevPets) => prevPets.filter((pet) => pet.id !== idAnimal));
        excluirPetApi(idUsuario, idAnimal);
    };

    const excluirPet = (id) => {
        Alert.alert(
            'Confirmação',
            'Tem certeza de que deseja excluir este pet?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', onPress: () => processoExcluirPet(id) },
            ]
        );
    };

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

    useEffect(() => {
        const carregarDados = async () => {
            setLoading(true);
            await buscarPetsPorUsuario(idUsuario);
            setLoading(false);
        };

        carregarDados();
    }, []);

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Usuario")}>
                    <Ionicons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Dados dos Pets</Text>
            </View>

            {/* ScrollView com o conteúdo que pode ser rolado */}
            <KeyboardAwareScrollView
                style={styles.bodyContainer}
                contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }} // Garante o scroll correto
                keyboardShouldPersistTaps="handled"
                enableOnAndroid={true}
            >
                <TouchableOpacity style={styles.fotoContainer} onPress={selecionarFoto}>
                    <Image
                        source={foto ? { uri: foto } : require('../../assets/LogoPetON.png')}
                        style={styles.foto}
                    />
                    <Text style={styles.textoFoto}>Alterar Foto</Text>
                </TouchableOpacity>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Nome do Pet:</Text>
                    <TextInput
                        style={styles.input}
                        value={nome}
                        onChangeText={setNome}
                        placeholder="Digite o nome do pet"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Idade:</Text>
                    <TextInput
                        style={styles.input}
                        value={idade}
                        onChangeText={setIdade}
                        placeholder="Digite a idade do pet"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Raça:</Text>
                    <TextInput
                        style={styles.input}
                        value={raca}
                        onChangeText={setRaca}
                        placeholder="Digite a raça do pet"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Observações:</Text>
                    <TextInput
                        style={styles.input}
                        value={observacoes}
                        onChangeText={setObservacoes}
                        placeholder="Observações sobre o pet"
                        multiline
                    />
                </View>

                <TouchableOpacity onPress={addPet} style={styles.button}>
                    {
                        listaDePets.length === 0 ? (
                            <Text style={styles.buttonText}>Adicionar</Text>
                        ) :
                            (
                                <Text style={styles.buttonText}>Alterar</Text>
                            )
                    }
                </TouchableOpacity>

                <Text style={styles.title}>Lista dos pets cadastrados</Text>
                <View style={styles.petList}>
                    {listaDePets.length === 0 ? (
                        <Text style={styles.noPetsText}>Nenhum pet cadastrado ainda.</Text>
                    ) : (
                        listaDePets.map((pet) => (
                            <View key={pet.idAnimal} style={styles.petItem}>
                                <Image source={{ uri: pet.photo }} style={styles.petImage} />
                                <View style={styles.petDetails}>
                                    <Text style={styles.petText}>Nome: {pet.nome}</Text>
                                    <Text style={styles.petText}>Idade: {pet.idade}</Text>
                                    <Text style={styles.petText}>Raça: {pet.raca}</Text>
                                    <Text style={styles.petText}>Observações: {pet.observacoes}</Text>
                                </View>
                                <TouchableOpacity style={styles.deleteButton} onPress={() => excluirPet(pet.id)}>
                                    <Ionicons name="remove-circle" size={24} color="#ff4d4d" />
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    // Cabeçalho
    header: {
        paddingTop: 50,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center", // Centraliza o conteúdo horizontalmente
        padding: 15,
        elevation: 9,
        position: "relative", // Para posicionar o botão "voltar"
        borderBottomWidth: 1,
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
    // Corpo
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
    button: {
        backgroundColor: '#28A745',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    petList: {
        marginTop: 20,
    },
    petItem: {
        flexDirection: 'row',
        marginBottom: 20,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 1.5,
        alignItems: 'center',
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 15,
    },
    petDetails: {
        flex: 1,
        justifyContent: 'center',
    },
    petText: {
        fontSize: 16,
        color: '#333',
    },
    deleteButton: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,
    },
    noPetsText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#777',
    },
});

export default DadosPets;
