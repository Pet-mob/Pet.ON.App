import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Login from "../screens/Login.js";
import Principal from "../screens/Principal.js";
import Buscar from "../screens/Buscar.js"; // Você cria essa tela
import ConsultaAgendamento from "../screens/ConsultaAgendamento.js";
import Usuario from "../screens/Usuario.js";
import Agendamento from "../screens/Agendamento.js";
import DadosConta from "../screens/DadosConta.js";
import Privacidade from "../screens/Privacidade.js";
import DadosPets from "../screens/DadosPets.js";
import EsqueceuSenha from "../screens/EsqueceuSenha.js";
import RegistrarNovoUsuario from "../screens/RegistrarNovoUsuario.js";
import MenuInferior from "../components/menuInferior.js";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function Routes() {
  return (
    <Stack.Navigator
      initialRouteName="Login"
      screenOptions={{ gestureEnabled: false }}
    >
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Buscar"
        component={Buscar}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="MenuInferior"
        component={MenuInferior}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Agendamento"
        component={Agendamento}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DadosConta"
        component={DadosConta}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Privacidade"
        component={Privacidade}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="DadosPets"
        component={DadosPets}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="EsqueceuSenha"
        component={EsqueceuSenha}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RegistrarNovoUsuario"
        component={RegistrarNovoUsuario}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
