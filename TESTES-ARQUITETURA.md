# 🏗️ Arquitetura de Testes - Pet.ON.App

```mermaid
graph TB
    subgraph "📱 App React Native"
        App["App.js<br/>(Expo)"]
    end

    subgraph "🛣️ Rotas & Screens"
        Routes["routes.js<br/>(Navegação)"]
        Screens["Screens/*<br/>(Telas)"]
    end

    subgraph "🎨 Componentes"
        Components["components/*<br/>(UI)"]
    end

    subgraph "🔄 Estado Global"
        Store["store.js<br/>(Usuário/Empresa)"]
        StoreTests["__tests__/store.test.js<br/>✅ 9+ testes"]
    end

    subgraph "🌐 Serviços de API"
        Api["Service/api.js<br/>(Axios Instance)"]
        Auth["apiRequisicaoAuth.js<br/>(Login/Senha)"]
        Agendamento["apiRequisicaoAgendamento.js<br/>(Consultas)"]
        Usuario["apiRequisicaoUsuario.js<br/>(Perfil)"]
        Animal["apiRequisicaoAnimal.js"]
        Empresa["apiRequisicaoEmpresa.js"]
        Servico["apiRequisicaoServico.js"]
        Parametro["apiRequisicaoParametro.js"]
        Notificacao["apiRequisicaoNotificacao.js"]
    end

    subgraph "🧪 Testes Unitários (32+ testes)"
        AuthTests["__tests__/apiRequisicaoAuth.test.js<br/>✅ 6 testes<br/>90% cobertura"]
        AgendamentoTests["__tests__/apiRequisicaoAgendamento.test.js<br/>✅ 10 testes<br/>88% cobertura"]
        UsuarioTests["__tests__/apiRequisicaoUsuario.test.js<br/>✅ 7 testes<br/>92% cobertura"]
        ComponentTests["__tests__/*.test.js<br/>📋 Exemplos"]
    end

    subgraph "🧠 Mocking"
        MockApi["jest.mock('../api')<br/>- post<br/>- get<br/>- put"]
        MockAsync["jest.mock('AsyncStorage')<br/>- setItem<br/>- getItem"]
    end

    subgraph "📚 Documentação"
        ReadMe["TESTES-README.md"]
        Guide["TESTES-GUIA.md"]
        Advanced["TESTES-AVANCADO.md"]
        Template["TESTES-TEMPLATE.js"]
        CICD["TESTES-CI-CD.md"]
        Summary["TESTES-RESUMO.md"]
        Index["TESTES-INDICE.md"]
    end

    subgraph "⚙️ Configuração"
        JestConfig["jest.config.js"]
        JestSetup["jest.setup.js"]
        BabelConfig[".babelrc"]
        PackageJson["package.json<br/>(scripts)"]
    end

    subgraph "🚀 Execução"
        Run["npm test"]
        Watch["npm run test:watch"]
        Coverage["npm run test:coverage"]
        Debug["npm run test:debug"]
    end

    subgraph "🔄 CI/CD"
        GitHub["GitHub Actions"]
        CodeCov["Codecov"]
        Badge["Badge Status"]
    end

    subgraph "📊 Relatórios"
        CoverageReport["coverage/"]
        TestResults["test-results/"]
    end

    App --> Routes
    Routes --> Screens
    Screens --> Components
    Screens --> Store
    Screens --> Auth
    Screens --> Agendamento
    Screens --> Usuario

    Store --> StoreTests
    Auth --> AuthTests
    Agendamento --> AgendamentoTests
    Usuario --> UsuarioTests

    AuthTests --> MockApi
    AgendamentoTests --> MockApi
    UsuarioTests --> MockApi
    StoreTests --> MockAsync

    AuthTests --> Guide
    AgendamentoTests --> Advanced
    UsuarioTests --> Template

    JestConfig --> Run
    JestSetup --> Run
    BabelConfig --> Run
    PackageJson --> Run

    Run --> Coverage
    Watch --> Run
    Debug --> Run

    Coverage --> CoverageReport
    Run --> TestResults

    GitHub --> CodeCov
    CodeCov --> Badge

    ReadMe -.-> Run
    Guide -.-> AuthTests
    Template -.-> UsuarioTests
    CICD -.-> GitHub

    style App fill:#61DAFB,stroke:#333,stroke-width:2px
    style Store fill:#764ABC,stroke:#333,stroke-width:2px,color:#fff
    style Api fill:#90C53F,stroke:#333,stroke-width:2px
    style AuthTests fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style AgendamentoTests fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style UsuarioTests fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style JestConfig fill:#C21325,stroke:#333,stroke-width:2px,color:#fff
    style Run fill:#F7B500,stroke:#333,stroke-width:2px
    style GitHub fill:#171515,stroke:#333,stroke-width:2px,color:#fff
```

---

## 📊 Fluxo de Teste

```mermaid
sequenceDiagram
    participant Dev as Desenvolvedor
    participant Test as Teste
    participant API as API Mock
    participant Assert as Assertions

    Dev->>Test: Cria arquivo test.js

    Test->>Test: Arrange (preparar dados)
    Test->>API: Configura mock API

    Test->>Test: Act (executa função)
    Test->>API: Faz "chamada" para API
    API-->>Test: Retorna dados mockados

    Test->>Assert: Assert (valida)
    Assert-->>Test: ✅ Passou
    Test-->>Dev: Resultado verde
```

---

## 🏆 Hierarquia de Testes

```mermaid
graph TD
    All["🧪 Todos os Testes<br/>32+ testes"]

    APIs["🌐 Testes de API<br/>23+ testes"]
    State["🔄 Testes de Estado<br/>9+ testes"]
    Components["🎨 Componentes<br/>Exemplos"]

    Auth["Auth<br/>6 ✅"]
    Agendamento["Agendamento<br/>10 ✅"]
    Usuario["Usuário<br/>7 ✅"]

    Store["Store<br/>9+ ✅"]

    All -->|Serviços| APIs
    All -->|Estado| State
    All -->|Componentes| Components

    APIs --> Auth
    APIs --> Agendamento
    APIs --> Usuario

    State --> Store

    Auth -->|6| Auth1["enviarSMS"]
    Auth -->|6| Auth2["validarCodigo"]
    Auth -->|6| Auth3["redefinirSenha"]

    Agendamento -->|10| Ag1["buscarHorarios"]
    Agendamento -->|10| Ag2["adicionarAgendamento"]
    Agendamento -->|10| Ag3["buscarAgendamentos"]

    Usuario -->|7| U1["validarLogin"]
    Usuario -->|7| U2["alterarSenha"]
    Usuario -->|7| U3["alterarUsuario"]

    Store -->|9+| S1["Usuario"]
    Store -->|9+| S2["Empresa"]
    Store -->|9+| S3["Logout"]

    style All fill:#41AA58,stroke:#333,stroke-width:3px,color:#fff
    style APIs fill:#90C53F,stroke:#333,stroke-width:2px
    style State fill:#764ABC,stroke:#333,stroke-width:2px,color:#fff
    style Auth fill:#61DAFB,stroke:#333,stroke-width:2px
    style Agendamento fill:#61DAFB,stroke:#333,stroke-width:2px
    style Usuario fill:#61DAFB,stroke:#333,stroke-width:2px
    style Store fill:#F7B500,stroke:#333,stroke-width:2px
```

---

## 📈 Cobertura Esperada

```mermaid
graph LR
    A["apiRequisicaoAuth.js<br/>90% coverage"] -->|100%| Lines1["Lines"]
    A -->|85%| Branches1["Branches"]

    B["apiRequisicaoAgendamento.js<br/>88% coverage"] -->|88%| Lines2["Lines"]
    B -->|80%| Branches2["Branches"]

    C["apiRequisicaoUsuario.js<br/>92% coverage"] -->|92%| Lines3["Lines"]
    C -->|90%| Branches3["Branches"]

    D["store.js<br/>95% coverage"] -->|95%| Lines4["Lines"]
    D -->|90%| Branches4["Branches"]

    All["TOTAL: 90%<br/>coverage"] -.->|Meta| Meta["> 80%"]

    style A fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style B fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style C fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style All fill:#90C53F,stroke:#333,stroke-width:2px
    style Meta fill:#F7B500,stroke:#333,stroke-width:2px
    style Lines1 fill:#61DAFB,stroke:#333,stroke-width:1px
    style Branches1 fill:#764ABC,stroke:#333,stroke-width:1px,color:#fff
```

---

## 🎯 Guia de Navegação

```mermaid
graph TD
    Start["🚀 Início"] -->|Primeira Vez?| README["📖 TESTES-README.md<br/>5 minutos"]

    README -->|Entendi| Next1{Qual seu<br/>papel?}

    Start -->|Já Sou Dev| Next1

    Next1 -->|Preciso Testar| Guide["📖 TESTES-GUIA.md<br/>20 minutos"]
    Next1 -->|Caso Complexo| Advanced["📖 TESTES-AVANCADO.md<br/>15 exemplos"]
    Next1 -->|Template| Template["📋 TESTES-TEMPLATE.js<br/>Copiar & Adaptar"]
    Next1 -->|Setup CI/CD| CICD["📖 TESTES-CI-CD.md"]
    Next1 -->|Resumo| Summary["📖 TESTES-RESUMO.md"]

    Guide --> Code["Implementar Testes"]
    Advanced --> Code
    Template --> Code

    Code --> Test["npm test"]

    Test --> Pass{Testes<br/>Passam?}

    Pass -->|Sim| Coverage["npm run test:coverage<br/>Verificar cobertura"]
    Pass -->|Não| Guide

    Coverage --> Commit{Coverage<br/>> 80%?}
    Commit -->|Sim| Green["✅ Pronto<br/>para Push"]
    Commit -->|Não| Code

    Green --> PR["GitHub PR"]

    CICD --> CI["GitHub Actions"]
    CI --> AutoTest["Auto Testes"]
    AutoTest --> Badge["📊 Badge"]

    style Start fill:#F7B500,stroke:#333,stroke-width:2px
    style README fill:#61DAFB,stroke:#333,stroke-width:2px
    style Guide fill:#61DAFB,stroke:#333,stroke-width:2px
    style Code fill:#90C53F,stroke:#333,stroke-width:2px
    style Test fill:#C21325,stroke:#333,stroke-width:2px,color:#fff
    style Green fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style PR fill:#171515,stroke:#333,stroke-width:3px,color:#fff
    style CI fill:#171515,stroke:#333,stroke-width:2px,color:#fff
```

---

## 🔄 Ciclo de Desenvolvimento

```mermaid
graph TD
    A["1️⃣ Escrever Código<br/>src/Service/api.js"] -->B["2️⃣ Criar Testes<br/>__tests__/api.test.js"]

    B -->C["3️⃣ Rodar Testes<br/>npm test"]

    C -->D{✅ Testes<br/>Passam?}

    D -->|Não| E["🔧 Debugar<br/>npm run test:debug"]
    E -->C

    D -->|Sim| F["4️⃣ Coverage<br/>npm run test:coverage"]

    F -->G{> 80%<br/>Coverage?}

    G -->|Não| H["📝 Adicionar Testes"]
    H -->C

    G -->|Sim| I["5️⃣ Commit & Push"]

    I -->J["6️⃣ GitHub Actions<br/>Testes Automáticos"]

    J -->K{✅ CI Passa?}

    K -->|Não| E
    K -->|Sim| L["7️⃣ Merge PR<br/>✨ Código Testado"]

    style A fill:#61DAFB,stroke:#333,stroke-width:2px
    style B fill:#90C53F,stroke:#333,stroke-width:2px
    style C fill:#C21325,stroke:#333,stroke-width:2px,color:#fff
    style D fill:#F7B500,stroke:#333,stroke-width:2px
    style F fill:#C21325,stroke:#333,stroke-width:2px,color:#fff
    style G fill:#F7B500,stroke:#333,stroke-width:2px
    style I fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
    style J fill:#171515,stroke:#333,stroke-width:2px,color:#fff
    style L fill:#41AA58,stroke:#333,stroke-width:2px,color:#fff
```

---

## 📋 Check-in Rápido

```mermaid
graph TD
    Q1{Jest<br/>instalado?} -->|Não| S1["npm install"]
    Q1 -->|Sim| Q2

    S1 --> Q2{Testes<br/>passam?}

    Q2 -->|Não| S2["npm run test:debug"]
    Q2 -->|Sim| Q3

    S2 --> Q2

    Q3{Coverage<br/>> 80%?} -->|Não| S3["Adicionar Testes"]
    Q3 -->|Sim| Q4

    S3 --> Q3

    Q4{Code Review<br/>OK?} -->|Não| S4["Fazer Ajustes"]
    Q4 -->|Sim| Done["✅ Ready to Merge!"]

    S4 --> Q2

    style Done fill:#41AA58,stroke:#333,stroke-width:3px,color:#fff
    style Q1 fill:#F7B500,stroke:#333,stroke-width:2px
    style Q2 fill:#F7B500,stroke:#333,stroke-width:2px
    style Q3 fill:#F7B500,stroke:#333,stroke-width:2px
    style Q4 fill:#F7B500,stroke:#333,stroke-width:2px
```

---

**Status:** ✅ Tudo Pronto!

_Arquitetura criada: 18/03/2026_
