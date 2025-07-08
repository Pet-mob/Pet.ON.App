import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { getUsuarioStore } from "../store/store";
import Toast from "react-native-toast-message";
import apiRequisicaoUsuario from "../Service/apiRequisicaoUsuario"; // certifique-se que o caminho está correto
import AsyncStorage from "@react-native-async-storage/async-storage";

const Usuario = () => {
  const navigation = useNavigation();
  const usuarioStore = getUsuarioStore();
  const nomeUsuario = usuarioStore.nome;
  const idUsuario = usuarioStore.id;
  const [showModal, setShowModal] = useState(false);

  const handleDeletePress = () => {
    setShowModal(true);
  };

  const handleDeleteConfirm = async () => {
    setShowModal(false);
    try {
      const result = await apiRequisicaoUsuario.excluirContaUsuario(idUsuario);
      if (result === true) {
        // Limpe dados locais
        await AsyncStorage.clear();
        // Se usar store/contexto, limpe também:
        // usuarioStore.logout(); // Exemplo, ajuste conforme seu store

        Toast.show({
          type: "success",
          text1: "Conta excluída com sucesso!",
        });
        setTimeout(() => {
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        }, 1200);
      } else {
        Toast.show({
          type: "error",
          text1: "Erro ao excluir conta.",
          text2: "Tente novamente mais tarde.",
        });
        console.log("Erro ao excluir conta: retorno da API:", result);
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Erro ao excluir conta.",
        text2: "Tente novamente mais tarde.",
      });
      console.log("Erro ao excluir conta:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>{nomeUsuario}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.sectionTitle}>Conta</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("DadosConta")}
        >
          <Text style={styles.cardText}>Dados da Conta</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("Privacidade")}
        >
          <Text style={styles.cardText}>Privacidade</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Pets</Text>
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate("DadosPets")}
        >
          <Text style={styles.cardText}>Dados dos Pets</Text>
          <Ionicons name="chevron-forward" size={20} color="#888" />
        </TouchableOpacity>
      </ScrollView>

      {/* Botão de exclusão de conta no footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDeletePress}
        >
          <Text style={styles.deleteButtonText}>Excluir Conta</Text>
        </TouchableOpacity>
      </View>

      {/* Modal de confirmação */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Excluir Conta</Text>
            <Text style={styles.modalText}>
              Tem certeza que deseja excluir sua conta? Esta ação não pode ser
              desfeita.
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowModal(false)}
              >
                <Text style={styles.cancelButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmButton}
                onPress={handleDeleteConfirm}
              >
                <Text style={styles.confirmButtonText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F9F9",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  scrollContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  cardText: {
    fontSize: 16,
    color: "#333",
  },
  footer: {
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  deleteButton: {
    backgroundColor: "#FF4D4F",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  deleteButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#FF4D4F",
  },
  modalText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 24,
    textAlign: "center",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#EEE",
    padding: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#333",
    fontWeight: "bold",
  },
  confirmButton: {
    flex: 1,
    backgroundColor: "#FF4D4F",
    padding: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#FFF",
    fontWeight: "bold",
  },
});

export default Usuario;
