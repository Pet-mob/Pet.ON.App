import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import TelaLogin from './TelaLogin';
import TelaPrincipal from './TelaPrincipal';
import TelaAgendamento from './TelaAgendamento';
import TelaConsulta from './TelaConsulta';
import TelaUsuario from './TelaUsuario';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="TelaLogin">
            <Stack.Screen name="TelaLogin" component={TelaLogin} options={{ title: 'Login' }} />
            <Stack.Screen name="TelaPrincipal" component={TelaPrincipal} options={{ title: 'Principal' }} />
            <Stack.Screen name="TelaAgendamento" component={TelaAgendamento} options={{ title: 'Agendamento' }} />
            <Stack.Screen name="TelaConsulta" component={TelaConsulta} options={{ title: 'Consulta de Agendamentos' }} />
            <Stack.Screen name="TelaUsuario" component={TelaUsuario} options={{ title: 'Dados do Usuário' }} />
        </Stack.Navigator>
    );
}