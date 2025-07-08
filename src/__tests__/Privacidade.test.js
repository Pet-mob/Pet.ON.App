import Privacidade from '../screens/Privacidade';
import React from 'react';
import { render } from '@testing-library/react-native';
test('Privacidade renderiza', () => {
    const { toJSON } = render(<Privacidade />);
    expect(toJSON()).toBeTruthy();
});
