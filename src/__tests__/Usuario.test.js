import Usuario from '../screens/Usuario';
import React from 'react';
import { render } from '@testing-library/react-native';
test('Usuario renderiza', () => {
    const { toJSON } = render(<Usuario />);
    expect(toJSON()).toBeTruthy();
});
