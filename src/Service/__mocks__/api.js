// Mock automático para../api
// Este arquivo é automaticamente usado quando jest.mock("../api") é chamado

const mockApi = {
  post: jest.fn(),
  get: jest.fn(),
  put: jest.fn(),
  patch: jest.fn(),
  delete: jest.fn(),
};

export default mockApi;
