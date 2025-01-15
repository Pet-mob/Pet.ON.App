import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import Login from '../screens/Login.js';
import Principal from '../screens/Principal';
import Agendamento from '../screens/Agendamento';
import ConsultaAgendamento from '../screens/ConsultaAgendamento.js';
import Usuario from '../screens/Usuario';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    Keyboard,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';

const Stack = createStackNavigator();

export default function Routes() {
    return (
        <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <Stack.Screen
                name="Principal"
                component={Principal}
                // options={{
                //     headerTitle: 'Página Principal',  // Título
                //     headerRight: () => (
                //         <TouchableOpacity onPress={() => alert('Botão clicado')}>
                //             <Text style={{ marginRight: 15, color: 'blue' }}>Botão</Text>
                //         </TouchableOpacity>
                //     ),
                // }}
                // options={{
                //     headerTitle: () => (
                //         <Image
                //             source={require('../../assets/LogoPetON.png')}
                //             style={{ width: 100, height: 40 }}
                //             resizeMode="contain"
                //         />
                //     ),
                //     headerStyle: {
                //         backgroundColor: '#f8f8f8',  // Cor de fundo do header
                //     },
                // }}
                // options={{
                //     header: () => (
                //         <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, backgroundColor: '#28A745' }}>
                //             <Text style={{ color: '#fff', fontSize: 18 }}>Página Principal</Text>
                //             <TouchableOpacity onPress={() => alert('Menu')}>
                //                 <Text style={{ color: '#fff' }}>Menu</Text>
                //             </TouchableOpacity>
                //         </View>
                //     ),
                // }}
                options={{
                    headerStyle: {
                        backgroundColor: '#4CAF50',  // Cor de fundo
                        height: 80,  // Altura do header
                    },
                    headerTitleStyle: {
                        fontWeight: 'bold',  // Estilo do título
                    },
                }}
            />
            <Stack.Screen name="Agendamento" component={Agendamento} options={{ title: 'Agendamento' }} />
            <Stack.Screen name="ConsultaAgendamento" component={ConsultaAgendamento} options={{ title: 'Consulta de Agendamentos' }} />
            <Stack.Screen name="Usuario" component={Usuario} options={{ title: 'Dados do Usuário' }} />
        </Stack.Navigator>
    );
}