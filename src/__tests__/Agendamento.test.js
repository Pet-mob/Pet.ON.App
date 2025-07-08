import Agendamento from '../screens/Agendamento';
import React from 'react';
import { render } from '@testing-library/react-native';
test('Agendamento renderiza', () => {
    const { toJSON } = render(<Agendamento />);
    expect(toJSON()).toBeTruthy();
});
