import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Linking, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { getEmpresaStore } from "../store/store";
import { useNavigation } from "@react-navigation/native";

const logoGrande = require("../../assets/LogoGrande.png");

const ContatoEmpresa = () => {
  const empresa = getEmpresaStore();
  const navigation = useNavigation();

  // Exemplo de dados de contato
  const telefone = empresa?.telefone || "(16) 981090989";
  const email = empresa?.email || "equipepetmob@gmail.com";
  const endereco = empresa?.endereco || "Ribeirão Preto - SP";
  const site = empresa?.site || "petmob.com.br";

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="chevron-back-outline" size={28} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Contato da Empresa</Text>
      </View>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.infoBox}>
          {/* Logo grande */}
          <Image
            source={logoGrande}
            style={styles.logoGrande}
            resizeMode="contain"
          />
          {/* Removido nome da empresa aqui */}
          <Text style={styles.label}>Endereço:</Text>
          <Text style={styles.value}>{endereco}</Text>
          <Text style={styles.label}>Telefone:</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`tel:${telefone}`)}>
            <Text style={[styles.value, styles.link]}>{telefone}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>E-mail:</Text>
          <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
            <Text style={[styles.value, styles.link]}>{email}</Text>
          </TouchableOpacity>
          {site && (
            <>
              <Text style={styles.label}>Site:</Text>
              <TouchableOpacity onPress={() => Linking.openURL(site)}>
                <Text style={[styles.value, styles.link]}>{site}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
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
  content: {
    padding: 24,
    alignItems: "center",
  },
  infoBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  logoGrande: {
    width: 306,
    height: 136,
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginTop: 10,
  },
  value: {
    fontSize: 15,
    color: "#222",
    marginTop: 2,
    marginBottom: 4,
    textAlign: "center",
  },
  link: {
    color: "#007aff",
    textDecorationLine: "underline",
  },
});

export default ContatoEmpresa;
