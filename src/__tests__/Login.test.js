import Login from '../screens/Login';
import React from 'react';
import { render } from '@testing-library/react-native';
test('Login renderiza', () => {
    const { toJSON } = render(<Login />);
    expect(toJSON()).toBeTruthy();
});
