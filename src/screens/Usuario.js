import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons"; // Certifique-se de instalar: expo install @expo/vector-icons

const Usuario = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Cabeçalho */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate("Principal")}>
                    <Ionicons name="arrow-back" size={30} color="#000" />
                </TouchableOpacity>
                <Text style={styles.title}>Rennan</Text>
            </View>

            {/* Menu */}
            <View style={styles.menuContainer}>
                <Text style={styles.sectionTitle}>Conta</Text>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate("DadosConta")}
                >
                    <Text style={styles.menuText}>Dados da Conta</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate("Privacidade")}
                >
                    <Text style={styles.menuText}>Privacidade</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>Pets</Text>
                <TouchableOpacity
                    style={styles.menuItem}
                    onPress={() => navigation.navigate("DadosPets")}
                >
                    <Text style={styles.menuText}>Dados dos Pets</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
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
    menuContainer: {
        padding: 10,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
        marginTop: 20,
    },
    menuItem: {
        padding: 15,
        backgroundColor: "#fff",
        borderRadius: 8,
        marginBottom: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 5,
        elevation: 3,
    },
    menuText: {
        fontSize: 16,
        color: "#333",
    },
});

export default Usuario;
