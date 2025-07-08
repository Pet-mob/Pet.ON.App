import EsqueceuSenha from '../screens/EsqueceuSenha';
import React from 'react';
import { render } from '@testing-library/react-native';
test('EsqueceuSenha renderiza', () => {
    const { toJSON } = render(<EsqueceuSenha />);
    expect(toJSON()).toBeTruthy();
});
