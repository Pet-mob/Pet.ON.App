import NotificacaoToastCustomizado from '../components/notificacaoToastCustomizado';
import React from 'react';
import { render } from '@testing-library/react-native';
test('notificacaoToastCustomizado renderiza', () => {
    const { toJSON } = render(<NotificacaoToastCustomizado />);
    expect(toJSON()).toBeTruthy();
});
