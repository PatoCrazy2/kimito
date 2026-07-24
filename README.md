# Kimito - Sistema de Gestión de Limpieza de Áreas Comunes

Kimito es un monorepo para gestionar la limpieza de áreas comunes en casas compartidas. Permite repartir tareas de forma manual y automática, generar calendarios equitativos según el peso de cada labor, enviar notificaciones al completarlas, y mantener una reputación por usuario que sirve como carta de presentación al cambiar de casa. También incluye un marketplace para buscar o ser roommate.

---

## 🚀 Funcionalidades Principales (Sprint 3)

### 🧮 Algoritmo de Reparto Equitativo (Scheduling)

- **Algoritmo Puro Greedy Bin Packing**: Reparte las tareas del hogar de forma balanceada según sus pesos acumulados entre los habitantes de la casa.
- **Asignación Automática vía Cron Job**: Automatizado con `@nestjs/schedule` para generar asignaciones semanales todos los lunes.
- **Override Manual**: Permite a los miembros reasignar puntualmente cualquier tarea a otro compañero.

### 🔔 Notificaciones Push VAPID (Web Push Nativo)

- **Sin terceros**: Implementación directa con la librería `web-push` nativa usando claves VAPID.
- **Service Worker en el Navegador**: Recepción de avisos emergentes cuando se asignan tareas o tus compañeros las completan.

### ⭐️ Sistema de Reputación por Usuario

- **Score Dinámico (0.0 a 5.0 Estrellas)**: Calculado en tiempo real en base al historial de cumplimiento (tareas completadas a tiempo vs. a destiempo/vencidas).
- **Carta de Presentación**: Visualización de efectividad y estadísticas para aplicaciones de roommates.

### 📸 Almacenamiento de Evidencias (Storage S3 / Local)

- **Carga de Evidencia Visual**: Captura o subida de foto al marcar tareas como completadas.
- **Soporte Híbrido**: Integración con Amazon S3 (`@aws-sdk/client-s3`) para producción y fallback automático a almacenamiento local en disco (`/uploads`) durante el desarrollo.

---

## 🛠️ Estructura del Monorepo

Este proyecto está organizado como un monorepo usando **Turborepo** y **pnpm** como gestor de paquetes:

```
apps/
  web/          → Aplicación Frontend en Next.js 16 (App Router, Tailwind CSS, shadcn/ui)
  api/          → API Backend en NestJS (Prisma ORM, Web Push, S3 Storage, Cron Jobs)
packages/
  shared-types/ → Tipos e interfaces de TypeScript compartidos entre frontend y backend
```

---

## Requisitos Previos

- **Node.js** v20 o superior
- **pnpm** v10 o superior instalado en tu máquina (`npm install -g pnpm`)
- **Docker & Docker Compose** (para la base de datos PostgreSQL local)

---

## Configuración Inicial

1. **Instalar dependencias del monorepo:**
   Ejecuta esto en la raíz del proyecto para descargar e instalar todas las dependencias y vincular localmente los paquetes:

   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno:**
   Copia los archivos de variables de entorno de ejemplo tanto para el backend como para el frontend:

   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. **Iniciar la base de datos local:**
   Levanta la base de datos PostgreSQL local en segundo plano usando Docker Compose:

   ```bash
   docker compose up -d
   ```

4. **Sincronizar el esquema de Prisma:**
   Aplica las migraciones en la base de datos local:
   ```bash
   pnpm --filter api exec prisma db push
   ```

---

## Desarrollo Local

Para levantar el frontend y el backend de manera simultánea en modo desarrollo:

```bash
pnpm dev
```

Esto iniciará:

- **Backend (api - NestJS):** `http://localhost:3000`
- **Frontend (web - Next.js):** `http://localhost:3001`

---

## Compilación para Producción

Para compilar todo el monorepo y verificar que no existan errores de tipado o empaquetado:

```bash
pnpm build
```

---

## ¿Cómo funciona Docker en este Monorepo?

El backend (`apps/api`) cuenta con un `Dockerfile` diseñado para compilar la API y empaquetarla en una imagen ligera de producción.

### ¿Por qué el Dockerfile es especial en un Monorepo?

Como la API (`apps/api`) depende de los tipos compartidos localizados en `packages/shared-types`, **no puedes compilar la API de manera aislada**. El proceso de Docker necesita conocer la raíz entera del proyecto para poder acceder a los archivos de `packages/shared-types`.

### Paso a paso del Dockerfile (Multi-stage Build):

1. **Etapa de Construcción (builder):**
   - Copia la configuración del monorepo y los `package.json` de todos los proyectos.
   - Instala todas las dependencias (`dependencies` y `devDependencies`).
   - Copia el código fuente de `apps/api` y de `packages/shared-types`.
   - Genera el cliente de Prisma y compila la aplicación NestJS en JavaScript puro (guardándolo en `dist/`).
   - Limpia las dependencias de desarrollo dejando únicamente las necesarias para producción (`pnpm install --prod`).
2. **Etapa de Ejecución (runner):**
   - Inicia desde una imagen limpia de Alpine Node.
   - Copia únicamente los archivos de producción compilados (`dist/`) y las dependencias de producción (`node_modules`), ignorando el código fuente y las herramientas de desarrollo. Esto reduce drásticamente el peso de la imagen final.
