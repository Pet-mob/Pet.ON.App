import DadosPets from '../screens/DadosPets';
import React from 'react';
import { render } from '@testing-library/react-native';
test('DadosPets renderiza', () => {
    const { toJSON } = render(<DadosPets />);
    expect(toJSON()).toBeTruthy();
});
