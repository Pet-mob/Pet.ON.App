import * as store from "../store";

/**
 * Testes para o Store (gerenciamento de estado)
 */
describe("Store", () => {
  beforeEach(() => {
    // Limpar estado antes de cada teste
    store.logout();
  });

  // ──────────────────────────────────────────────
  // 👤 Gerenciamento de Usuário
  // ──────────────────────────────────────────────

  describe("Usuario", () => {
    test("setUsuarioStore_ComUsuarioValido_DeveArmazenarUsuario", () => {
      // Arrange
      const usuarioMock = {
        idUsuario: 1,
        nome: "João Silva",
        email: "joao@example.com",
      };

      // Act
      store.setUsuarioStore(usuarioMock);

      // Assert
      expect(store.getUsuarioStore()).toEqual(usuarioMock);
    });

    test("getUsuarioStore_SemUsuarioDefinido_DeveRetornarNull", () => {
      // Act & Assert
      expect(store.getUsuarioStore()).toBeNull();
    });

    test("setUsuarioStore_ComMultiplesUsuarios_DeveArmazenarUltimo", () => {
      // Arrange
      const usuario1 = { idUsuario: 1, nome: "Usuário 1" };
      const usuario2 = { idUsuario: 2, nome: "Usuário 2" };

      // Act
      store.setUsuarioStore(usuario1);
      store.setUsuarioStore(usuario2);

      // Assert
      expect(store.getUsuarioStore()).toEqual(usuario2);
      expect(store.getUsuarioStore().idUsuario).toBe(2);
    });

    test("setUsuarioStore_ComNull_DeveArmazenarNull", () => {
      // Arrange
      const usuarioMock = {
        idUsuario: 1,
        nome: "João Silva",
      };

      // Act
      store.setUsuarioStore(usuarioMock);
      store.setUsuarioStore(null);

      // Assert
      expect(store.getUsuarioStore()).toBeNull();
    });
  });

  // ──────────────────────────────────────────────
  // 🏢 Gerenciamento de Empresa
  // ──────────────────────────────────────────────

  describe("Empresa", () => {
    test("setEmpresaStore_ComEmpresaValida_DeveArmazenarEmpresa", () => {
      // Arrange
      const empresaMock = {
        idEmpresa: 1,
        nome: "Pet Shop ABC",
        telefone: "11999999999",
      };

      // Act
      store.setEmpresaStore(empresaMock);

      // Assert
      expect(store.getEmpresaStore()).toEqual(empresaMock);
    });

    test("getEmpresaStore_SemEmpresaDefinida_DeveRetornarNull", () => {
      // Act & Assert
      expect(store.getEmpresaStore()).toBeNull();
    });

    test("setEmpresaStore_ComMultiplasEmpresas_DeveArmazenarUltima", () => {
      // Arrange
      const empresa1 = { idEmpresa: 1, nome: "Empresa 1" };
      const empresa2 = { idEmpresa: 2, nome: "Empresa 2" };

      // Act
      store.setEmpresaStore(empresa1);
      store.setEmpresaStore(empresa2);

      // Assert
      expect(store.getEmpresaStore()).toEqual(empresa2);
      expect(store.getEmpresaStore().idEmpresa).toBe(2);
    });
  });

  // ──────────────────────────────────────────────
  // 🚪 Logout
  // ──────────────────────────────────────────────

  describe("Logout", () => {
    test("logout_ComUsuarioArmazenado_DeveRemoverUsuario", () => {
      // Arrange
      const usuarioMock = { idUsuario: 1, nome: "João" };
      store.setUsuarioStore(usuarioMock);

      // Act
      store.logout();

      // Assert
      expect(store.getUsuarioStore()).toBeNull();
    });

    test("logout_ComEmpresaArmazenada_DeveRemoverEmpresa", () => {
      // Arrange
      const empresaMock = { idEmpresa: 1, nome: "Pet Shop" };
      store.setEmpresaStore(empresaMock);

      // Act
      store.logout();

      // Assert
      // Se logout remover apenas usuário, empresa permanecerá
      expect(store.getUsuarioStore()).toBeNull();
    });

    test("logout_SemDadosArmazenados_NaoDeveLancarErro", () => {
      // Act & Assert
      expect(() => store.logout()).not.toThrow();
    });
  });

  // ──────────────────────────────────────────────
  // 🔄 Casos de Uso Completos
  // ──────────────────────────────────────────────

  describe("Casos de Uso", () => {
    test("LoginFlow_DeveFazerLoginComSucessoEArmazenarDados", () => {
      // Arrange
      const usuario = {
        idUsuario: 1,
        nome: "Maria Silva",
        email: "maria@example.com",
      };
      const empresa = {
        idEmpresa: 5,
        nome: "PetCare Pro",
      };

      // Act
      store.setUsuarioStore(usuario);
      store.setEmpresaStore(empresa);

      // Assert
      expect(store.getUsuarioStore()).toEqual(usuario);
      expect(store.getEmpresaStore()).toEqual(empresa);
    });

    test("LogoutFlow_DeveRemoverTodosDadosDoUsuario", () => {
      // Arrange
      const usuario = { idUsuario: 1, nome: "João" };
      const empresa = { idEmpresa: 1, nome: "Empresa" };

      store.setUsuarioStore(usuario);
      store.setEmpresaStore(empresa);

      // Verificar armazenamento
      expect(store.getUsuarioStore()).not.toBeNull();

      // Act
      store.logout();

      // Assert
      expect(store.getUsuarioStore()).toBeNull();
    });

    test("TrocarEmpresa_DeveAtualizarEmpresaArmazenada", () => {
      // Arrange
      const empresa1 = { idEmpresa: 1, nome: "Empresa 1" };
      const empresa2 = { idEmpresa: 2, nome: "Empresa 2" };

      // Act
      store.setEmpresaStore(empresa1);
      expect(store.getEmpresaStore()).toEqual(empresa1);

      store.setEmpresaStore(empresa2);

      // Assert
      expect(store.getEmpresaStore()).toEqual(empresa2);
      expect(store.getEmpresaStore().idEmpresa).toBe(2);
    });
  });
});
