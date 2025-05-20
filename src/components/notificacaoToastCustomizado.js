// ToastConfig.js
import React from 'react';
import { BaseToast, ErrorToast } from 'react-native-toast-message';

export const notificacaoToastCustomizado = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{ borderLeftColor: '#4CAF50', backgroundColor: '#E8F5E9' }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#2E7D32',
            }}
            text2Style={{
                fontSize: 14,
                color: '#2E7D32',
            }}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            style={{ borderLeftColor: '#F44336', backgroundColor: '#FFEBEE', marginTop: 50 }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 16,
                fontWeight: '600',
                color: '#C62828',
            }}
            text2Style={{
                fontSize: 14,
                color: '#C62828',
            }}
        />
    ),
};
