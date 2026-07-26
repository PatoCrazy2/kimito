# Kimito - Sistema de Gestión de Limpieza de Áreas Comunes

Kimito es un monorepo para gestionar la limpieza de áreas comunes en casas compartidas. Permite repartir tareas de forma manual y automática, generar calendarios equitativos según el peso de cada labor, enviar notificaciones al completarlas, y mantener una reputación por usuario que sirve como carta de presentación al buscar roomies. También incluye un marketplace para publicar habitaciones disponibles y encontrar compañeros de vivienda compatibles.

---

## Tecnologías

| Capa | Stack |
|------|-------|
| Frontend | Next.js 16 (App Router, Turbopack), React 19, TailwindCSS 4, shadcn/ui, Framer Motion |
| Backend | NestJS 11, Prisma ORM 6, PostgreSQL 16 |
| Autenticación | Auth.js (NextAuth) v5 beta + JWT HS256 compartido |
| Notificaciones | Web Push nativo (VAPID) con Service Worker |
| Almacenamiento | AWS S3 / fallback local (`/uploads`) |
| Monorepo | Turborepo + pnpm workspaces |
| Infraestructura | Docker Compose (dev), Dockerfile multi-stage (prod) |

---

## Arquitectura

```
kimito/
├── apps/
│   ├── web/             → Frontend Next.js 16 (puerto 3001)
│   └── api/             → Backend NestJS (puerto 3000)
├── packages/
│   └── shared-types/    → Tipos TypeScript compartidos (DTOs, Responses)
├── docker-compose.yml   → PostgreSQL local
├── turbo.json           → Configuración Turborepo
└── pnpm-workspace.yaml  → Definición de workspaces
```

### Módulos del Backend

| Módulo | Descripción |
|--------|-------------|
| `AuthModule` | Registro, login, verificación JWT |
| `HousesModule` | CRUD casas, invitaciones, membresías |
| `TasksModule` | Catálogo de tareas del hogar |
| `SchedulingModule` | Algoritmo Greedy Bin Packing + Cron semanal |
| `NotificationsModule` | Push VAPID nativo |
| `ReputationModule` | Score dinámico 0.0–5.0 estrellas |
| `StorageModule` | Upload de evidencias (S3/local) |
| `ListingsModule` | Marketplace de roomies y habitaciones (Sprint 4) |

---

## Requisitos Previos

- **Node.js** v20 o superior
- **pnpm** v10 o superior (`npm install -g pnpm`)
- **Docker & Docker Compose** (para PostgreSQL local)

---

## Instalación

```bash
# 1. Clonar el repositorio
git clone <repo-url> && cd kimito

# 2. Instalar dependencias (genera Prisma Client automáticamente)
pnpm install

# 3. Configurar variables de entorno
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env
# Editar ambos archivos con tus credenciales

# 4. Levantar base de datos
docker compose up -d

# 5. Sincronizar esquema de Prisma
pnpm --filter api exec prisma db push
```

---

## Variables de Entorno

### Backend (`apps/api/.env`)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Connection string PostgreSQL |
| `AUTH_SECRET` | Secret compartido con frontend para JWT (mínimo 32 chars) |
| `GOOGLE_CLIENT_ID` | OAuth Google (opcional) |
| `GOOGLE_CLIENT_SECRET` | OAuth Google (opcional) |
| `VAPID_PUBLIC_KEY` | Clave pública VAPID para push |
| `VAPID_PRIVATE_KEY` | Clave privada VAPID para push |
| `AWS_REGION` | Región S3 |
| `AWS_S3_BUCKET` | Nombre del bucket S3 |

### Frontend (`apps/web/.env`)

| Variable | Descripción |
|----------|-------------|
| `NEXT_PUBLIC_API_URL` | URL del backend (default: `http://localhost:3000`) |
| `AUTH_SECRET` | Debe ser idéntico al del backend |
| `GOOGLE_CLIENT_ID` | OAuth Google (opcional) |
| `GOOGLE_CLIENT_SECRET` | OAuth Google (opcional) |

---

## Docker

### Desarrollo (PostgreSQL local)

```bash
docker compose up -d        # Levantar PostgreSQL
docker compose down         # Detener
docker compose down -v      # Detener y borrar datos
```

### Producción (API en Docker)

```bash
docker build -t kimito-api -f apps/api/Dockerfile .
docker run -p 3000:3000 --env-file apps/api/.env kimito-api
```

El Dockerfile usa multi-stage build: compila en una etapa y copia solo los artefactos de producción a la imagen final.

---

## Prisma

```bash
# Generar cliente Prisma
pnpm --filter api exec prisma generate

# Sincronizar schema → DB (desarrollo)
pnpm --filter api exec prisma db push

# Crear migración nueva
pnpm --filter api exec prisma migrate dev --name nombre_migracion

# Aplicar migraciones (producción)
pnpm --filter api exec prisma migrate deploy

# Abrir Prisma Studio (GUI)
pnpm --filter api exec prisma studio
```

---

## Migraciones

Las migraciones se encuentran en `apps/api/prisma/migrations/`:

| Migración | Descripción |
|-----------|-------------|
| `20260723043410_init` | Schema inicial (User, House, Task, etc.) |
| `20260725_add_marketplace_listing` | Modelo Listing expandido para Marketplace |

---

## Desarrollo Local

```bash
# Levantar frontend + backend simultáneamente
pnpm dev
```

Esto inicia:
- **Backend (NestJS):** http://localhost:3000
- **Frontend (Next.js):** http://localhost:3001

### Ejecutar solo backend

```bash
pnpm --filter api dev
```

### Ejecutar solo frontend

```bash
pnpm --filter web dev
```

---

## Scripts Disponibles

| Script | Descripción |
|--------|-------------|
| `pnpm dev` | Desarrollo (todos los packages) |
| `pnpm build` | Build de producción |
| `pnpm lint` | ESLint en todo el monorepo |
| `pnpm format` | Prettier en todo el monorepo |
| `pnpm --filter api test` | Tests unitarios del backend |
| `pnpm --filter api test:e2e` | Tests E2E del backend |

---

## Flujo del Proyecto

```
Registro/Login
    ↓
Crear Casa o Unirse (código de invitación)
    ↓
Configurar Tareas del Hogar (catálogo + custom)
    ↓
Generar Reparto Semanal (automático lunes o manual)
    ↓
Completar Tareas (con foto de evidencia)
    ↓
Actualización de Reputación (score dinámico)
    ↓
Encuentra Roomie (buscar habitaciones / publicar la tuya)
```

---

## Marketplace (Sprint 4)

El marketplace permite a los miembros de la comunidad publicar habitaciones disponibles y encontrar roomies compatibles. La reputación de cada usuario funciona como carta de presentación para generar confianza.

### Endpoints

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/listings` | Crear publicación de habitación (auth requerida) |
| `GET` | `/listings` | Listar publicaciones con filtros y paginación |
| `GET` | `/listings/:id` | Obtener una publicación |
| `PATCH` | `/listings/:id` | Editar publicación (solo dueño) |
| `DELETE` | `/listings/:id` | Eliminar publicación (solo dueño) |

### Filtros disponibles (query params)

- `location` — Ubicación (búsqueda parcial)
- `minRent` / `maxRent` — Rango de renta mensual
- `availableFrom` — Disponible a partir de (fecha ISO)
- `petsAllowed` — Acepta mascotas (true/false)
- `smokingAllowed` — Acepta fumadores (true/false)
- `preferredGender` — Género preferido (MALE, FEMALE, ANY)
- `search` — Búsqueda por título, descripción o ubicación
- `page` / `limit` — Paginación

### Integración con Reputación

Cada publicación incluye automáticamente el score del publicador para generar confianza entre posibles roomies:

```json
{
  "owner": {
    "id": "uuid",
    "name": "Ana Martínez",
    "avatarUrl": null,
    "reputationScore": 4.8
  }
}
```

---

## Sistema de Reputación

Score dinámico de 0.0 a 5.0 estrellas calculado en base al historial de cumplimiento:

- **5.0** = Todas las tareas completadas a tiempo
- **0.0** = Ninguna tarea completada

Fórmula: `5.0 × (completadas a tiempo / total evaluables)`

Las tareas expiradas cuentan como no completadas. El score se actualiza en tiempo real y se muestra en el perfil del usuario y en sus publicaciones del marketplace.

---

## Integrantes

- Herson Urdiales

