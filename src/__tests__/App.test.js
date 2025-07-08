import React from 'react';
import { render } from '@testing-library/react-native';
import App from '../../App';

test('deve renderizar o App', () => {
    const { toJSON } = render(<App />);
    expect(toJSON()).toBeTruthy();
});
