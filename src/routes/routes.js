import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login.js';
import Principal from '../screens/Principal';
import Agendamento from '../screens/Agendamento';
import ConsultaAgendamento from '../screens/ConsultaAgendamento.js';
import Usuario from '../screens/Usuario';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ title: 'Login' }} />
            <Stack.Screen name="Principal" component={Principal} options={{ title: 'Principal' }} />
            <Stack.Screen name="Agendamento" component={Agendamento} options={{ title: 'Agendamento' }} />
            <Stack.Screen name="ConsultaAgendamento" component={ConsultaAgendamento} options={{ title: 'Consulta de Agendamentos' }} />
            <Stack.Screen name="Usuario" component={Usuario} options={{ title: 'Dados do Usuário' }} />
        </Stack.Navigator>
    );
}