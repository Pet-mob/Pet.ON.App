import ExpoImageWithPlaceholder from '../components/ExpoImageWithPlaceholder';
import React from 'react';
import { render } from '@testing-library/react-native';
test('ExpoImageWithPlaceholder renderiza', () => {
    const { toJSON } = render(<ExpoImageWithPlaceholder />);
    expect(toJSON()).toBeTruthy();
});
