import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Image,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
// import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

export default function UserProfileScreen({ navigation, route }) {
    const parametrosRotas = route.params;

    const titulo = parametrosRotas.EhUsuarioNovo ? 'Crie uma conta' : 'Dados da conta';
    const tituloBotaoCriarConta = parametrosRotas.EhUsuarioNovo ? 'Criar conta' : 'Salvar conta';

    const [forms, setForms] = useState({
        Nome: 'Rennan Castanhehira',
        Telefone: '(16) 99355-7709',
        Endereco: 'Rua x.',
        Senha: '1234',
    });

    const [pets, setPets] = useState([
        {
            id: '1',
            name: 'Buddy',
            age: '2 anos',
            allergies: 'Nenhuma',
            size: 'Médio',
            // image: require('../../../assets/cachorro1.png'),
        },
    ]);

    const [newPet, setNewPet] = useState({
        name: '',
        age: '',
        allergies: '',
        size: '',
        image: null,
    });

    const handlePickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permissão Negada', 'Precisamos de permissão para acessar a galeria!');
            return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });
        if (!result.canceled) {
            setNewPet({ ...newPet, image: result.assets[0].uri });
        }
    };

    const handleAddPet = () => {
        if (!newPet.name || !newPet.age || !newPet.size) {
            Alert.alert('Erro', 'Por favor, preencha todas as informações obrigatórias.');
            return;
        }
        setPets([...pets, { ...newPet, id: String(Date.now()) }]);
        setNewPet({ name: '', age: '', allergies: '', size: '', image: null });
        Alert.alert('Pet Adicionado', 'O pet foi cadastrado com sucesso!');
    };

    const handleRemovePet = (id) => {
        Alert.alert('Remover Pet', 'Tem certeza que deseja remover este pet?', [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Remover', onPress: () => setPets(pets.filter((pet) => pet.id !== id)) },
        ]);
    };

    const renderPet = ({ item }) => (
        <View style={styles.petItem}>
            <Image source={item.image} style={styles.petImage} />
            <View style={styles.petDetails}>
                <Text style={styles.petName}>{item.name}</Text>
                <Text style={styles.petInfo}>Idade: {item.age}</Text>
                <Text style={styles.petInfo}>Alergias: {item.allergies}</Text>
                <Text style={styles.petInfo}>Porte: {item.size}</Text>
            </View>
            <TouchableOpacity onPress={() => handleRemovePet(item.id)} style={styles.removeButton}>
                <Ionicons name="trash" size={20} color="#fff" />
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView>
                <View style={styles.headerContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Ionicons name="arrow-back" size={24} color="#333" />
                    </TouchableOpacity>
                    <Text style={styles.tituloCriaConta}>{titulo}</Text>
                </View>
                <View>
                    {/* <TouchableOpacity onPress={handlePickImage} style={styles.imagePicker}>
                        {newPet.image ? (
                            <Image source={{ uri: newPet.image }} style={styles.profileImage} />
                        ) : (
                            <Ionicons name="camera" size={50} color="#aaa" />
                        )}
                    </TouchableOpacity> */}
                    <Text style={styles.imagePickerText}>Adicionar foto do pet</Text>
                </View>
                <TextInput
                    style={styles.input}
                    placeholder="Nome do Pet"
                    value={newPet.name}
                    onChangeText={(text) => setNewPet({ ...newPet, name: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Idade do Pet"
                    value={newPet.age}
                    onChangeText={(text) => setNewPet({ ...newPet, age: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Alergias"
                    value={newPet.allergies}
                    onChangeText={(text) => setNewPet({ ...newPet, allergies: text })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Porte do Pet (Pequeno, Médio, Grande)"
                    value={newPet.size}
                    onChangeText={(text) => setNewPet({ ...newPet, size: text })}
                />
                <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
                    <Text style={styles.addButtonText}>Adicionar Pet</Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    // Estilizações atualizadas aqui...
});
