import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";

export const toastProximosAgendamentos = ({ agendamentos }) => {
  const [animacaoSlide] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (agendamentos?.length > 0) {
      Animated.spring(animacaoSlide, {
        toValue: 0,
        useNativeDriver: true,
      }).start();
    }
  }, [agendamentos]);

  if (!agendamentos?.length) return null;

  return (
    <Animated.View
      style={[
        estilos.container,
        {
          transform: [{ translateY: animacaoSlide }],
        },
      ]}
    >
      <Text style={estilos.titulo}>Próximos Agendamentos</Text>
      {agendamentos.slice(0, 3).map((agend, index) => (
        <Text key={index} style={estilos.agendamento}>
          {agend.nomePet} - {agend.tipoServico}
          {"\n"}
          {new Date(agend.dataAgendamento).toLocaleDateString()} às{" "}
          {agend.horaAgendamento}
        </Text>
      ))}
    </Animated.View>
  );
};

const estilos = StyleSheet.create({
  container: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: 300,
  },
  titulo: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  agendamento: {
    fontSize: 14,
    marginBottom: 5,
  },
});
