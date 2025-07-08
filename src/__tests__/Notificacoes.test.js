import Notificacoes from '../screens/Notificacoes';
import React from 'react';
import { render } from '@testing-library/react-native';
test('Notificacoes renderiza', () => {
    const { toJSON } = render(<Notificacoes />);
    expect(toJSON()).toBeTruthy();
});
