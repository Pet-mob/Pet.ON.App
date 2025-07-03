import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Icon from "react-native-vector-icons/Ionicons";

import Principal from "../screens/Principal";
import ConsultaAgendamento from "../screens/ConsultaAgendamento";
import Usuario from "../screens/Usuario";
import Buscar from "../screens/Buscar";

const Tab = createBottomTabNavigator();

export default function MenuInferior() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Principal") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Agendamentos") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Usuario") {
            iconName = focused ? "person" : "person-outline";
          } else if (route.name === "Explorar") {
            iconName = focused ? "search" : "search-outline";
          }

          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "black",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen name="Principal" component={Principal} />
      <Tab.Screen name="Explorar" component={Buscar} />
      <Tab.Screen name="Agendamentos" component={ConsultaAgendamento} />
      <Tab.Screen name="Usuario" component={Usuario} />
    </Tab.Navigator>
  );
}
