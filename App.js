import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import Routes from './src/routes/routes';
import Toast from 'react-native-toast-message';
import { notificacaoToastCustomizado } from './src/components/notificacaoToastCustomizado';
import { LocaleConfig } from 'react-native-calendars';

export default function App() {
  LocaleConfig.locales['pt-br'] = {
    monthNames: [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ],
    monthNamesShort: [
      'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
      'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
    ],
    dayNames: [
      'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira',
      'Quinta-feira', 'Sexta-feira', 'Sábado'
    ],
    dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
    today: 'Hoje'
  };

  LocaleConfig.defaultLocale = 'pt-br';

  return (
    <NavigationContainer>
      <Routes />
      <Toast config={notificacaoToastCustomizado} visibilityTime={3000} autoHide position="top" />
    </NavigationContainer>
  );
}

