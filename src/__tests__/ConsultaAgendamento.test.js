import ConsultaAgendamento from '../screens/ConsultaAgendamento';
import React from 'react';
import { render } from '@testing-library/react-native';
test('ConsultaAgendamento renderiza', () => {
    const { toJSON } = render(<ConsultaAgendamento />);
    expect(toJSON()).toBeTruthy();
});
