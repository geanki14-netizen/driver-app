 # Arquitectura — DriverApp

## Diagrama de módulos

```mermaid
graph TD
    A[main.ts] --> B[AppComponent]
    A --> C[CoreModule]
    A --> D[AppRoutingModule]

    B --> E[IonMenu - Menú lateral]
    B --> F[IonRouterOutlet]

    D --> G[SplashPage]
    D --> H[AuthModule]
    D --> I[HomeModule]
    D --> J[ProfileModule]
    D --> K[AdminModule]

    C --> L[AuthService]
    C --> M[CognitoService]
    C --> N[ApiService]
    C --> O[NotificationService]
    C --> P[LogService]
    C --> Q[GlobalErrorHandler]
    C --> R[AuthInterceptor]
    C --> S[ErrorInterceptor]
    C --> T[authGuard]
    C --> U[guestGuard]
    C --> V[roleGuard]

    L --> W[(StorageService)]
    M --> X[AWS Cognito]
    N --> Y[API REST]
    O --> Z[Firebase FCM]
```

## Flujo de autenticación

```mermaid
sequenceDiagram
    participant U as Usuario
    participant L as LoginPage
    participant C as CognitoService
    participant A as AuthService
    participant S as StorageService
    participant R as Router

    U->>L: Ingresa email y password
    L->>C: login(email, password)
    C->>X: signIn() via AWS Amplify
    X-->>C: SignInOutput
    C->>C: getUserAttributes()
    C-->>L: resultado
    L->>A: login(user)
    A->>S: set('auth_user', user)
    L->>R: navigateByUrl('/home')
```

## Flujo de guards

```mermaid
flowchart LR
    Nav[Navegación] --> AG{authGuard}
    AG -->|Autenticado| Page[Página protegida]
    AG -->|No autenticado| Login[/auth/login]

    Nav2[Navegación] --> GG{guestGuard}
    GG -->|No autenticado| LoginPage[Página de login]
    GG -->|Autenticado| Home[/home]

    Nav3[Navegación /admin] --> AG2{authGuard}
    AG2 -->|Autenticado| RG{roleGuard admin}
    RG -->|Es admin| Admin[Panel Admin]
    RG -->|No es admin| Home2[/home]
    AG2 -->|No autenticado| Login2[/auth/login]
```

## Estructura de ambientes

```mermaid
graph LR
    A[angular.json] --> B[development]
    A --> C[staging]
    A --> D[production]

    B --> E[environment.ts\napiUrl: localhost:3000\nCognito: dev pool]
    C --> F[environment.staging.ts\napiUrl: api-staging\nCognito: staging pool]
    D --> G[environment.prod.ts\napiUrl: api prod\nCognito: prod pool]
```
