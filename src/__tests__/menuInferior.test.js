import MenuInferior from '../components/menuInferior';
import React from 'react';
import { render } from '@testing-library/react-native';
test('menuInferior renderiza', () => {
    const { toJSON } = render(<MenuInferior />);
    expect(toJSON()).toBeTruthy();
});
