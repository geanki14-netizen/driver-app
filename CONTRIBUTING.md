# Guía de contribución — Rápido Ochoa App

Esta guía define los estándares que todo desarrollador debe seguir
para mantener la calidad y consistencia del código.

---

## Flujo de trabajo con Git

### Ramas

| Rama | Propósito |
|---|---|
| `main` | Producción — solo merges desde `develop` |
| `develop` | Integración — base para nuevas features |
| `feat/nombre` | Nueva funcionalidad |
| `fix/nombre` | Corrección de bug |
| `hotfix/nombre` | Fix urgente en producción |

### Proceso para agregar una funcionalidad

```bash
# 1. Crear rama desde develop
git checkout develop
git pull origin develop
git checkout -b feat/nombre-funcionalidad

# 2. Desarrollar y hacer commits frecuentes
git add .
git commit -m "feat: descripción corta de lo que hace"

# 3. Push y Pull Request
git push origin feat/nombre-funcionalidad
# Crear PR en GitHub hacia develop
```

### Convención de commits (Conventional Commits)
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
refactor: refactorización sin cambio de comportamiento
test: agregar o modificar tests
style: cambios de formato (no afectan la lógica)
chore: tareas de mantenimiento
---

## Estándares de código

### Naming conventions

| Elemento | Convención | Ejemplo |
|---|---|---|
| Componentes | PascalCase + sufijo | `LoginPage`, `HomeComponent` |
| Servicios | PascalCase + sufijo | `AuthService`, `ApiService` |
| Guards | camelCase + sufijo | `authGuard`, `guestGuard` |
| Interfaces | PascalCase | `User`, `ApiResponse` |
| Variables | camelCase | `currentUser`, `isLoading` |
| Constantes | UPPER_SNAKE_CASE | `MAX_RETRY_ATTEMPTS` |
| Archivos | kebab-case | `auth.service.ts`, `login.page.ts` |

### Estructura de un servicio nuevo

```typescript
import { Injectable, inject } from '@angular/core';
import { BaseService } from '@core/services';
import { LogService } from '@core/services';

@Injectable({ providedIn: 'root' })
export class NuevoService extends BaseService {
  private log = inject(LogService);

  // Métodos públicos primero
  getData(): void { }

  // Métodos privados al final
  private processData(): void { }
}
```

### Reglas importantes

- **Nunca** usar `HttpClient` directamente en un componente — siempre por `ApiService`
- **Nunca** hardcodear URLs o secrets — siempre por `environment`
- **Nunca** importar `CoreModule` fuera de `main.ts`
- **Siempre** usar `inject()` en lugar de inyección por constructor
- **Siempre** tipar las respuestas de la API con interfaces en `core/models`
- **Siempre** manejar errores con `catchError` o `try/catch`

---

## Cómo agregar un nuevo módulo (resumen rápido)

1. Crear carpetas en `src/app/features/nombre/`
2. Crear `nombre-routing.module.ts`
3. Crear `nombre.module.ts` importando `SharedModule`
4. Crear la página como standalone component
5. Registrar la ruta en `app.routes.ts` con `authGuard`
6. Agregar ítem al menú en `app.component.ts`

Ver guía detallada en `README.md`.

---

## Testing

Todo código nuevo debe incluir tests.

### Cobertura mínima esperada

- Servicios: unit tests con mocks de dependencias
- Guards: unit tests verificando allow/deny
- Flujos críticos: tests E2E en Cypress

### Correr tests antes de hacer PR

```bash
npx ng test --watch=false    # Unit tests
npx cypress run --headless   # E2E (con ionic serve corriendo)
```

---

## Checklist de Pull Request

Antes de crear un PR verifica:

- [ ] El código compila sin errores (`npm run build:dev`)
- [ ] El linter pasa sin errores (`npx ng lint`)
- [ ] Los tests pasan (`npx ng test --watch=false`)
- [ ] Se agregaron tests para el código nuevo
- [ ] No hay `console.log` de debug en el código
- [ ] No hay valores hardcodeados que deberían estar en `environment`
- [ ] El nombre de la rama sigue la convención (`feat/`, `fix/`, etc.)
- [ ] El commit message sigue Conventional Commits

---

## Preguntas frecuentes del equipo

**¿Dónde pongo un componente que se usa en varios features?**
En `src/app/shared/components/` y expórtalo desde `SharedModule`.

**¿Cómo protejo una ruta para que solo la vean admins?**
`canActivate: [authGuard, roleGuard(['admin'])]` en `app.routes.ts`.

**¿Cómo agrego una variable que cambie entre dev y prod?**
Agrégala en los 3 archivos `environment.*.ts` e impórtala con `@environments/environment`.

**¿Cómo envío una push notification?**
Desde Firebase Console → Messaging, o desde tu backend usando la Server Key de FCM.

**¿Cómo creo un usuario admin?**
Desde la consola de AWS Cognito → User Pool → Users → Create user, y asigna el atributo `custom:role = admin`.