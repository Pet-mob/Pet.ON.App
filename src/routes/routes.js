import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login.js';
import Principal from '../screens/Principal';
import Agendamento from '../screens/Agendamento';
import ConsultaAgendamento from '../screens/ConsultaAgendamento.js';
import Usuario from '../screens/Usuario';
import DadosContas from '../screens/DadosConta.js';
import Privacidade from '../screens/Privacidade.js';
import DadosPets from '../screens/DadosPets.js';
import EsqueceuSenha from '../screens/EsqueceuSenha.js';
import RegistrarUsuarioNovo from '../screens/RegistrarNovoUsuario.js';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Login"
            screenOptions={{ gestureEnabled: false }}>
            <Stack.Screen
                name="Login"
                component={Login}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Principal"
                component={Principal}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Agendamento"
                component={Agendamento}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="ConsultaAgendamento"
                component={ConsultaAgendamento}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="Usuario"
                component={Usuario}
                options={{ headerShown: false }}
            />
            <Stack.Screen
                name="DadosConta"
                component={DadosContas}
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
                component={RegistrarUsuarioNovo}
                options={{ headerShown: false }}
            />
        </Stack.Navigator>
    );
}