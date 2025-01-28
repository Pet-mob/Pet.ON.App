import React, { useState } from 'react';
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

const DadosPets = () => {
    const [pets, setPets] = useState([
        { id: 1, photo: 'https://via.placeholder.com/100', name: 'Rex', age: 2, breed: 'Labrador', notes: 'Muito dócil' },
        { id: 2, photo: 'https://via.placeholder.com/100', name: 'Bella', age: 3, breed: 'Golden Retriever', notes: 'Adora brincar' },
    ]);

    const excluirPet = (id) => {
        Alert.alert(
            'Confirmação',
            'Tem certeza de que deseja excluir este pet?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Excluir', onPress: () => setPets((prevPets) => prevPets.filter((pet) => pet.id !== id)) },
            ]
        );
    };

    const [petName, setPetName] = useState('');
    const [petAge, setPetAge] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petNotes, setPetNotes] = useState('');
    const [petPhoto, setPetPhoto] = useState(null);
    const navigation = useNavigation();
    const [foto, setFoto] = useState(null);

    const addPet = () => {
        if (petName && petAge && petBreed) {
            setPets([...pets, { id: Date.now(), name: petName, age: petAge, breed: petBreed, notes: petNotes, photo: petPhoto }]);
            setPetName('');
            setPetAge('');
            setPetBreed('');
            setPetNotes('');
            setPetPhoto(null);
        }
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
                        value={petName}
                        onChangeText={setPetName}
                        placeholder="Digite o nome do pet"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Idade:</Text>
                    <TextInput
                        style={styles.input}
                        value={petAge}
                        onChangeText={setPetAge}
                        placeholder="Digite a idade do pet"
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Raça:</Text>
                    <TextInput
                        style={styles.input}
                        value={petBreed}
                        onChangeText={setPetBreed}
                        placeholder="Digite a raça do pet"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <Text style={styles.label}>Observações:</Text>
                    <TextInput
                        style={styles.input}
                        value={petNotes}
                        onChangeText={setPetNotes}
                        placeholder="Observações sobre o pet"
                        multiline
                    />
                </View>

                <TouchableOpacity onPress={addPet} style={styles.button}>
                    <Text style={styles.buttonText}>Adicionar</Text>
                </TouchableOpacity>

                <Text style={styles.title}>Lista dos pets cadastrados</Text>
                <View style={styles.petList}>
                    {pets.length === 0 ? (
                        <Text style={styles.noPetsText}>Nenhum pet cadastrado ainda.</Text>
                    ) : (
                        pets.map((pet) => (
                            <View key={pet.id} style={styles.petItem}>
                                <Image source={{ uri: pet.photo }} style={styles.petImage} />
                                <View style={styles.petDetails}>
                                    <Text style={styles.petText}>Nome: {pet.name}</Text>
                                    <Text style={styles.petText}>Idade: {pet.age}</Text>
                                    <Text style={styles.petText}>Raça: {pet.breed}</Text>
                                    <Text style={styles.petText}>Observações: {pet.notes}</Text>
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
