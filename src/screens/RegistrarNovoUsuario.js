import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
// import { api } from "../services/api";
import { useNavigation } from "@react-navigation/native";

const RegistrarUsuarioNovo = () => {
    const navigation = useNavigation();

    // Dados do usuário
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [fotoUsuario, setFotoUsuario] = useState(null);

    // Dados do pet
    const [nomePet, setNomePet] = useState("");
    const [raca, setRaca] = useState("");
    const [fotoPet, setFotoPet] = useState(null);

    const escolherImagem = async (setImagem) => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permissão para acessar a galeria é necessária!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 0.7,
        });

        if (!result.canceled) {
            setImagem(result.assets[0]);
        }
    };

    const salvar = async () => {
        try {
            // // 1. Cadastrar usuário
            // const usuarioDTO = { nome, email, senha };
            // const respostaUsuario = await api.post("/Usuario/CriarUsuario", usuarioDTO);
            // const idUsuario = respostaUsuario.data.id;

            // // 2. Enviar foto do usuário
            // if (fotoUsuario) {
            //     const formDataUsuario = new FormData();
            //     formDataUsuario.append("arquivo", {
            //         uri: fotoUsuario.uri,
            //         type: "image/jpeg",
            //         name: "usuario.jpg"
            //     });
            //     formDataUsuario.append("idUsuario", idUsuario);
            //     await api.post("/Usuario/EnviarFotoDoUsuario", formDataUsuario, {
            //         headers: { "Content-Type": "multipart/form-data" }
            //     });
            // }

            // // 3. Cadastrar pet
            // const petDTO = {
            //     nome: nomePet,
            //     raca,
            //     idUsuario
            // };
            // const respostaPet = await api.post("/Animal/CadastrarAnimal", petDTO);
            // const idAnimal = respostaPet.data.id;

            // // 4. Enviar foto do pet
            // if (fotoPet) {
            //     const formDataPet = new FormData();
            //     formDataPet.append("arquivo", {
            //         uri: fotoPet.uri,
            //         type: "image/jpeg",
            //         name: "pet.jpg"
            //     });
            //     formDataPet.append("idUsuario", idUsuario);
            //     formDataPet.append("idAnimal", idAnimal);
            //     await api.post("/Animal/EnviarFotoAnimal", formDataPet, {
            //         headers: { "Content-Type": "multipart/form-data" }
            //     });
            // }

            // Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
            // navigation.navigate("Login");
        } catch (error) {
            console.error("Erro no cadastro:", error);
            Alert.alert("Erro", "Ocorreu um erro ao registrar.");
        }
    };

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.titulo}>Cadastro do Usuário</Text>

            <TouchableOpacity onPress={() => escolherImagem(setFotoUsuario)} style={styles.imagePicker}>
                {fotoUsuario ? (
                    <Image source={{ uri: fotoUsuario.uri }} style={styles.imagePreview} />
                ) : (
                    <Text style={styles.imageText}>Selecionar Foto do Usuário</Text>
                )}
            </TouchableOpacity>

            <TextInput placeholder="Nome" value={nome} onChangeText={setNome} style={styles.input} />
            <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
            <TextInput placeholder="Senha" value={senha} onChangeText={setSenha} style={styles.input} secureTextEntry />

            <Text style={styles.titulo}>Cadastro do Pet</Text>

            <TouchableOpacity onPress={() => escolherImagem(setFotoPet)} style={styles.imagePicker}>
                {fotoPet ? (
                    <Image source={{ uri: fotoPet.uri }} style={styles.imagePreview} />
                ) : (
                    <Text style={styles.imageText}>Selecionar Foto do Pet</Text>
                )}
            </TouchableOpacity>

            <TextInput placeholder="Nome do Pet" value={nomePet} onChangeText={setNomePet} style={styles.input} />
            <TextInput placeholder="Raça do Pet" value={raca} onChangeText={setRaca} style={styles.input} />

            <TouchableOpacity onPress={salvar} style={styles.botao}>
                <Text style={styles.botaoTexto}>Registrar</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#FFF",
    },
    titulo: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 15,
        marginTop: 25,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: "#CCC",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#FFF",
    },
    botao: {
        backgroundColor: "#4CAF50",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 20,
    },
    botaoTexto: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    imagePicker: {
        height: 150,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: "#CCC",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 20,
    },
    imagePreview: {
        width: "100%",
        height: "100%",
        borderRadius: 10,
    },
    imageText: {
        color: "#999",
    },
});

export default RegistrarUsuarioNovo;
