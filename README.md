 # DriverApp — Rápido Ochoa

App móvil base construida con **Ionic + Angular + Capacitor** para **Rápido Ochoa**.
Nombre técnico del proyecto: `DriverApp`
Sirve como punto de partida para el desarrollo de nuevas funcionalidades.

> Transportamos tus ilusiones 🚌

---

## Tabla de contenidos

1. [Stack tecnológico](#stack-tecnológico)
2. [Decisiones de arquitectura](#decisiones-de-arquitectura)
3. [Prerrequisitos](#prerrequisitos)
4. [Instalación](#instalación)
5. [Estructura del proyecto](#estructura-del-proyecto)
6. [Ambientes](#ambientes)
7. [Autenticación con Cognito](#autenticación-con-cognito)
8. [Cómo agregar un nuevo módulo](#cómo-agregar-un-nuevo-módulo)
9. [Push Notifications](#push-notifications)
10. [Guards y control de acceso](#guards-y-control-de-acceso)
11. [Testing](#testing)
12. [Build y compilación](#build-y-compilación)
13. [Credenciales de prueba](#credenciales-de-prueba)
14. [Troubleshooting](#troubleshooting)

---

## Stack tecnológico

| Tecnología | Versión | Rol |
|---|---|---|
| Ionic | 8.x | Framework UI |
| Angular | 20.x | Framework web (standalone) |
| Capacitor | 8.x | Bridge nativo iOS/Android |
| AWS Amplify | 6.x | Autenticación con Cognito |
| TypeScript | 5.9 | Tipado estático |
| RxJS | 7.8 | Estado y flujos asíncronos |
| Firebase FCM | — | Push notifications |

---

## Decisiones de arquitectura

### Estrategia de estado
**BehaviorSubject de RxJS** — escala bien para esta app sin la complejidad de NgRx.

### Autenticación
**AWS Cognito via Amplify** — manejo de tokens, refresh automático y verificación de email incluidos.

### Testing
**Karma + Jasmine** para unit tests. **Cypress** para E2E.

### Runtime nativo
**Capacitor exclusivamente** — sin plugins de Cordova. Estándar oficial de Ionic para proyectos nuevos.

### Componentes
**Standalone components** (Angular 17+) — sin NgModules en los features, lazy loading por ruta.

---

## Prerrequisitos

- Node.js LTS (v18 o v20): https://nodejs.org
- Ionic CLI: `npm install -g @ionic/cli`
- Angular CLI: `npm install -g @angular/cli`
- Android Studio (para compilar Android): https://developer.android.com/studio
- Xcode en Mac (para compilar iOS)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/geanki14-netizen/driver-app.git
cd driver-app

# 2. Instalar dependencias
npm install

# 3. Levantar el mock API (en una terminal separada)
json-server --watch db.json --port 3000 --host 0.0.0.0

# 4. Correr la app en el browser
npm run serve:dev
```

Un desarrollador nuevo debe poder correr la app en menos de 10 minutos siguiendo estos pasos.

---

## Estructura del proyecto

src/
├── app/
│   ├── core/                    # Singleton — importado UNA vez en main.ts
│   │   ├── guards/              # AuthGuard, GuestGuard, RoleGuard
│   │   ├── interceptors/        # AuthInterceptor, ErrorInterceptor
│   │   ├── models/              # Interfaces globales (User, ApiResponse)
│   │   ├── services/            # AuthService, ApiService, CognitoService...
│   │   ├── core.module.ts
│   │   └── global-error-handler.ts
│   │
│   ├── shared/                  # Reutilizable en cualquier feature
│   │   ├── constants/           # Routes, ErrorMessages
│   │   └── shared.module.ts
│   │
│   └── features/                # Módulos lazy-loaded por funcionalidad
│       ├── auth/                # Login, Registro
│       ├── home/                # Pantalla principal
│       ├── profile/             # Perfil de usuario
│       ├── admin/               # Panel de administración (solo admin)
│       └── splash/              # Pantalla de bienvenida
│
├── environments/
│   ├── environment.ts           # Desarrollo local
│   ├── environment.staging.ts   # Staging / QA
│   └── environment.prod.ts      # Producción
│
└── assets/
└── logo-rapido-ochoa.png

**Regla de oro:**
- `AppModule` importa `CoreModule` una sola vez
- Los features importan `SharedModule`
- Los features NO se importan entre sí directamente

---

## Ambientes

| Ambiente | Comando | API |
|---|---|---|
| Development | `npm run serve:dev` | http://localhost:3000 (json-server) |
| Staging | `npm run serve:staging` | https://api-staging.rapidoochoa.com/v1 |
| Production | `npm run serve:prod` | https://api.rapidoochoa.com/v1 |

### Agregar una nueva variable de ambiente

1. Agrégala en los 3 archivos `environment.*.ts`
2. Úsala importando `environment` desde `@environments/environment`
3. Nunca hardcodees valores que cambien entre ambientes

---

## Autenticación con Cognito

La app usa **AWS Cognito** para autenticación. El flujo es:
LoginPage → CognitoService.login() → AWS Cognito
→ AuthService.login() → StorageService (guarda usuario)
→ Navigate to /home

### Configurar un nuevo ambiente de Cognito

Actualiza el bloque `cognito` en el archivo de environment correspondiente:

```typescript
cognito: {
  userPoolId: 'us-east-1_XXXXXXXXX',
  clientId: 'XXXXXXXXXXXXXXXXXXXXXXXXXX',
  region: 'us-east-1',
}
```

### Roles de usuario

Los roles se asignan en el atributo `custom:role` de Cognito o se hardcodean en el login.
Roles disponibles: `'user'` | `'admin'`

---

## Cómo agregar un nuevo módulo

Ejemplo: agregar un módulo `trips` (viajes).

### Paso 1 — Crear las carpetas

```bash
mkdir -p src/app/features/trips/pages/trips
mkdir -p src/app/features/trips/services
```

### Paso 2 — Crear el componente de página

```typescript
// src/app/features/trips/pages/trips/trips.page.ts
@Component({
  selector: 'app-trips',
  templateUrl: './trips.page.html',
  standalone: true,
  imports: [CommonModule, IonicModule],
})
export class TripsPage {}
```

### Paso 3 — Crear el routing module

```typescript
// src/app/features/trips/trips-routing.module.ts
const routes: Routes = [
  { path: '', loadComponent: () => import('./pages/trips/trips.page').then(m => m.TripsPage) }
];
```

### Paso 4 — Crear el module

```typescript
// src/app/features/trips/trips.module.ts
@NgModule({ imports: [SharedModule, TripsRoutingModule] })
export class TripsModule {}
```

### Paso 5 — Registrar la ruta en `app.routes.ts`

```typescript
{
  path: 'trips',
  loadChildren: () => import('./features/trips/trips.module').then(m => m.TripsModule),
  canActivate: [authGuard],
}
```

### Paso 6 — Agregar al menú en `app.component.ts`

```typescript
{ title: 'Mis Viajes', url: '/trips', icon: 'bus-outline' }
```

---

## Push Notifications

Las push notifications usan **Firebase FCM** para Android y **APNs** para iOS.

### Configuración por ambiente

Cada ambiente tiene su propio proyecto de Firebase. El `notificationSenderId` se configura en `environment.*.ts`.

### Flujo de registro
App abre → NotificationService.init() → Solicita permisos
→ PushNotifications.register() → FCM devuelve token
→ Enviar token al backend para almacenarlo

### Deep linking desde notificación

Para navegar a una pantalla específica al tapear una notificación, incluye en los datos:

```json
{ "route": "/trips" }
```

El `NotificationService` leerá ese campo y navegará automáticamente.

---

## Guards y control de acceso

| Guard | Descripción | Uso |
|---|---|---|
| `authGuard` | Requiere sesión activa | Rutas protegidas (`/home`, `/profile`) |
| `guestGuard` | Requiere NO tener sesión | `/auth/login`, `/auth/register` |
| `roleGuard(['admin'])` | Requiere rol específico | `/admin` |

### Agregar un nuevo guard

```typescript
// Proteger una ruta solo para admins
{
  path: 'reports',
  loadChildren: () => import('./features/reports/reports.module').then(m => m.ReportsModule),
  canActivate: [authGuard, roleGuard(['admin'])],
}
```

---

## Testing

### Unit tests (Karma + Jasmine)

```bash
npx ng test --watch=false
# Resultado esperado: 17/17 SUCCESS
```

### E2E tests (Cypress)

```bash
# Con ionic serve corriendo en otra terminal:
npx cypress run --headless
# Resultado esperado: 13/13 passing
```

### Agregar un nuevo unit test

Crea `nombre.service.spec.ts` en la misma carpeta del servicio y sigue el patrón de `auth.service.spec.ts`.

---

## Build y compilación

### Web

```bash
npm run build:dev      # Development
npm run build:staging  # Staging
npm run build:prod     # Production
```

### Android

```bash
npm run build:dev
npx cap sync android
npx cap open android
# Luego en Android Studio: Run → Run 'app'
```

### iOS (requiere Mac con Xcode)

```bash
npm install @capacitor/ios
npx cap add ios
npm run build:dev
npx cap sync ios
npx cap open ios
# Luego en Xcode: Product → Run
```

---

## Credenciales de prueba

> ⚠️ Solo para el ambiente de desarrollo con json-server

| Usuario | Email | Password | Rol |
|---|---|---|---|
| Admin | admin@test.com | 123456 | admin |
| Usuario | user@test.com | 123456 | user |

Para el ambiente real, los usuarios se crean desde la pantalla de **Registro** de la app o desde la consola de AWS Cognito.