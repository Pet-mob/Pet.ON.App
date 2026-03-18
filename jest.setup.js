// Configuração global para Jest
// Mockar react-native que não é puro JavaScript
jest.mock("react-native", () => ({
  Platform: {
    OS: "ios",
    select: (obj) => obj.ios,
  },
}));

// Mockar react-native-toast-message
jest.mock("react-native-toast-message", () => ({
  BaseToast: function BaseToast(props) {
    return null;
  },
  ErrorToast: function ErrorToast(props) {
    return null;
  },
}));

// Configurar timeouts padrão
jest.setTimeout(10000);

// Mockar AsyncStorage por padrão
jest.mock("@react-native-async-storage/async-storage", () => ({
  setItem: jest.fn().mockResolvedValue(null),
  getItem: jest.fn().mockResolvedValue(null),
  removeItem: jest.fn().mockResolvedValue(null),
  clear: jest.fn().mockResolvedValue(null),
}));

// Mockar console para testes mais limpos se necessário
global.console = {
  ...console,
};
