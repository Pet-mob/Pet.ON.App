import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from "@react-navigation/native";

const DadosPets = () => {
    const [pets, setPets] = useState([]);
    const [petName, setPetName] = useState('');
    const [petAge, setPetAge] = useState('');
    const [petBreed, setPetBreed] = useState('');
    const [petNotes, setPetNotes] = useState('');
    const [petPhoto, setPetPhoto] = useState(null);
    const navigation = useNavigation();

    const addPet = () => {
        if (petName && petAge && petBreed) {
            setPets([...pets, { name: petName, age: petAge, breed: petBreed, notes: petNotes, photo: petPhoto }]);
            setPetName('');
            setPetAge('');
            setPetBreed('');
            setPetNotes('');
            setPetPhoto(null);
        }
    };

    const selecionarImagem = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaType.Images,  // Atualizado para usar MediaType
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    const tirarFoto = async () => {
        const result = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setFoto(result.assets[0].uri);
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Usuario")}>
                    <Ionicons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Dados dos Pets</Text>
            </View>

            <View style={styles.bodyContainer}>

                <TouchableOpacity onPress={selecionarImagem} style={styles.imageButton}>
                    {petPhoto ? (
                        <Image source={{ uri: petPhoto }} style={styles.image} />
                    ) : (
                        <Text style={styles.imageButtonText}>Selecionar Foto</Text>
                    )}
                </TouchableOpacity>
                <TouchableOpacity onPress={tirarFoto} style={styles.imageButtonSecondary}>
                    <Text style={styles.imageButtonText}>Tirar Foto</Text>
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
                    <Text style={styles.buttonText}>Adicionar Pet</Text>
                </TouchableOpacity>

                <View style={styles.petList}>
                    {pets.map((pet, index) => (
                        <View key={index} style={styles.petItem}>
                            <Image source={{ uri: pet.photo }} style={styles.petImage} />
                            <View style={styles.petDetails}>
                                <Text style={styles.petText}>Nome: {pet.name}</Text>
                                <Text style={styles.petText}>Idade: {pet.age}</Text>
                                <Text style={styles.petText}>Raça: {pet.breed}</Text>
                                <Text style={styles.petText}>Observações: {pet.notes}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f9f9f9',
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
        backgroundColor: '#fff',
    },
    imageButton: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 150,
        width: 150,
        borderRadius: 75,
        backgroundColor: '#e0e0e0',
        alignSelf: 'center',
        marginBottom: 20,
    },
    imageButtonSecondary: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: '#007bff',
        borderRadius: 8,
        marginBottom: 20,
    },
    imageButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    image: {
        width: 150,
        height: 150,
        borderRadius: 75,
    },
    button: {
        backgroundColor: '#007bff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
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
    },
    petImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 15,
    },
    petDetails: {
        justifyContent: 'center',
    },
    petText: {
        fontSize: 16,
        color: '#333',
    },
});

export default DadosPets;
