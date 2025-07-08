import RegistrarNovoUsuario from '../screens/RegistrarNovoUsuario';
import React from 'react';
import { render } from '@testing-library/react-native';
test('RegistrarNovoUsuario renderiza', () => {
    const { toJSON } = render(<RegistrarNovoUsuario />);
    expect(toJSON()).toBeTruthy();
});
