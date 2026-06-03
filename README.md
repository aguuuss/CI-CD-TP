# CI-CD-TP

Trabajo práctico simple para demostrar un entorno de integración continua y entrega continua con una app frontend mínima.

## Objetivo

La app no busca resolver un problema de producto. Es un `Hola Mundo` hecho con Vite, React y TypeScript para poder mostrar rápidamente qué pasa cuando un cambio pasa o rompe el pipeline.

Flujo principal:

```text
Cambio en repo -> GitHub Actions -> typecheck/test/build -> deploy en Vercel -> feedback en Linear
```

## Herramientas

- Repositorio de código: GitHub
- Servidor de integración continua: GitHub Actions
- App frontend: Vite + React + TypeScript
- Gestor de paquetes: pnpm
- Prueba automatizada: Vitest + Testing Library
- Entrega continua: Vercel CLI desde GitHub Actions
- Feedback del resultado: comentario automático en Linear
- Fallback de entrega: VPS con Docker si Vercel no está disponible

## Entorno local

Requisitos:

- Node.js 22 o superior
- pnpm 10

Comandos:

```bash
pnpm install
pnpm dev
pnpm typecheck
pnpm test
pnpm build
```

## Gates del pipeline

El workflow `.github/workflows/ci-cd.yml` valida tres cosas antes de entregar:

1. `pnpm typecheck`: rechaza errores de TypeScript.
2. `pnpm test`: rechaza cambios que rompen la prueba automatizada.
3. `pnpm build`: rechaza cambios que no pueden compilarse para entrega.

En cualquier branch o PR, GitHub Actions ejecuta las validaciones. En `main`, si esos tres pasos pasan, ejecuta el deploy a Vercel y publica el resultado en Linear.

## Estructura usada

```text
.
├── .github/workflows/ci-cd.yml      # Pipeline de GitHub Actions
├── docs/slides/esquema-ci-cd-tp.html # Slide HTML con el esquema del TP
├── scripts/post-linear-feedback.mjs # Feedback automatico hacia Linear
├── src/App.tsx                      # App Hola Mundo
├── src/App.test.tsx                 # Prueba automatizada
├── vercel.json                      # Desactiva deploy automatico por Git
├── package.json                     # Scripts locales y dependencias
└── pnpm-lock.yaml                   # Lockfile del package manager
```

## Casos de uso para probar

### Caso 1: cambio verde local

Objetivo: demostrar que el entorno de desarrollador puede validar el cambio antes de subirlo.

```bash
pnpm install
pnpm typecheck
pnpm test
pnpm build
```

Resultado esperado: los tres gates pasan.

### Caso 2: cambio verde en `main`

Objetivo: demostrar entrega continua.

1. Hacer un cambio que no rompa `Hola Mundo`.
2. Subirlo a `main`.
3. Ver GitHub Actions en verde.
4. Ver deploy en Vercel.
5. Ver comentario automatico en Linear.

### Caso 3: romper la prueba

Objetivo: demostrar que el Test Gate bloquea la entrega.

1. Cambiar el texto `Hola Mundo` en `src/App.tsx`.
2. Ejecutar:

```bash
pnpm test
```

Resultado esperado: falla el test porque `src/App.test.tsx` espera encontrar `Hola Mundo`.

### Caso 4: romper TypeScript

Objetivo: demostrar que el Type Gate bloquea la entrega antes del build.

Agregar temporalmente:

```ts
const demo: number = "esto rompe TypeScript";
```

Ejecutar:

```bash
pnpm typecheck
```

Resultado esperado: falla TypeScript.

### Caso 5: romper el build

Objetivo: demostrar que el Build Gate bloquea la entrega si la app no compila.

1. Romper temporalmente un import, por ejemplo en `src/main.tsx`.
2. Ejecutar:

```bash
pnpm build
```

Resultado esperado: Vite/TypeScript falla y no hay deploy.

## Como demostrar un cambio exitoso

1. Hacer un cambio simple que no altere el saludo esperado.
2. Ejecutar localmente:

```bash
pnpm typecheck
pnpm test
pnpm build
```

3. Subir el cambio al repositorio.
4. Ver que GitHub Actions pasa.
5. Ver que el deploy a Vercel se publica desde `main`.
6. Ver que Linear recibe el comentario automático con el resultado.

## Como romper el pipeline

Para romper el Test Gate:

1. Cambiar `Hola Mundo` en `src/App.tsx` por otro texto.
2. Ejecutar `pnpm test`.
3. El test falla porque espera encontrar el heading `Hola Mundo`.

Para romper el Type Gate:

1. Agregar un error de tipos en cualquier archivo TypeScript, por ejemplo:

```ts
const demo: number = "esto rompe TypeScript";
```

2. Ejecutar `pnpm typecheck`.
3. TypeScript falla antes del build y del deploy.

## Secrets necesarios en GitHub

Para Vercel:

- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

El archivo `vercel.json` desactiva los deploys automaticos de Vercel por Git. De esta manera, Vercel queda como entorno de entrega, pero el deploy lo dispara GitHub Actions solo despues de pasar typecheck, tests y build.

Para Linear:

- `LINEAR_API_KEY`
- `LINEAR_ISSUE_ID`

`LINEAR_ISSUE_ID` puede ser el identificador visible del issue, por ejemplo `ABC-123`. La idea es crear un issue fijo llamado algo como `Seguimiento de despliegues CI/CD` y dejar que cada corrida en `main` agregue un comentario con el resultado.

## Guion corto para la defensa

1. Mostrar la app local: es intencionalmente mínima.
2. Mostrar los comandos locales: typecheck, test y build.
3. Mostrar el workflow de GitHub Actions.
4. Explicar que los branches y PRs validan, pero solo `main` despliega.
5. Mostrar un cambio exitoso llegando a Vercel.
6. Mostrar un cambio roto fallando antes del deploy.
7. Mostrar el comentario automático en Linear como feedback final del pipeline.

## Slide del esquema

La slide para la presentacion esta en `docs/slides/esquema-ci-cd-tp.html`. Resume el flujo del TP y muestra las herramientas utilizadas.
