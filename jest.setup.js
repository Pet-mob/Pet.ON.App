// Mock do AsyncStorage para testes com Jest
jest.mock('@react-native-async-storage/async-storage', () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Mock NativeAnimatedHelper
// jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');
