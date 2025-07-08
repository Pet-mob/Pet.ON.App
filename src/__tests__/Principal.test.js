import Principal from '../screens/Principal';
import React from 'react';
import { render } from '@testing-library/react-native';
test('Principal renderiza', () => {
    const { toJSON } = render(<Principal />);
    expect(toJSON()).toBeTruthy();
});
