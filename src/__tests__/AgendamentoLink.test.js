import AgendamentoLink from '../screens/AgendamentoLink';
import React from 'react';
import { render } from '@testing-library/react-native';
test('AgendamentoLink renderiza', () => {
    const { toJSON } = render(<AgendamentoLink />);
    expect(toJSON()).toBeTruthy();
});
