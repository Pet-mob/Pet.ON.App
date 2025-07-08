import DadosConta from '../screens/DadosConta';
import React from 'react';
import { render } from '@testing-library/react-native';
test('DadosConta renderiza', () => {
    const { toJSON } = render(<DadosConta />);
    expect(toJSON()).toBeTruthy();
});
