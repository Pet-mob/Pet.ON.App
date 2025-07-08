import Buscar from '../screens/Buscar';
import React from 'react';
import { render } from '@testing-library/react-native';
test('Buscar renderiza', () => {
    const { toJSON } = render(<Buscar />);
    expect(toJSON()).toBeTruthy();
});
