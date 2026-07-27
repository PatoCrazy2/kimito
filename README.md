<p align="center">
  <img src="apps/web/public/kimitohero.webp" alt="Kimito Hero Banner" width="100%" style="border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.08);" />
</p>

<h1 align="center">✨ Kimito — La Infraestructura de Confianza para Co-Living ✨</h1>

<p align="center">
  <strong>El primer pasaporte de coexistencia y marketplace verificado para un hogar compartido sin fricciones.</strong>
</p>

<p align="center">
  <a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" /></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white" alt="Next.js" /></a>
  <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
  <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
  <a href="https://www.prisma.io/"><img src="https://img.shields.io/badge/Prisma_ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white" alt="Prisma" /></a>
  <a href="https://aws.amazon.com/"><img src="https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazon-aws&logoColor=white" alt="AWS" /></a>
</p>

<p align="center">
  Next.js (App Router) + NestJS + Prisma ORM + AWS (S3, RDS, Beanstalk) + Web Push (VAPID)
</p>

---

## 💡 El Producto & Funcionalidades

Compartir vivienda presenta retos organizacionales complejos. Un alto porcentaje de los conflictos entre roommates surge por la desigualdad en la limpieza y la falta de rendición de cuentas. Kimito resuelve esto mediante un registro de rendimiento del hogar transparente y estructurado.

A continuación, se presenta el flujo completo de funcionalidades en orden secuencial del producto:

### 🏠 1. Gestión de Hogares y Coexistencia
*   **Crear un Hogar Compartido:** Registra un nuevo hogar con su nombre, descripción, reglas y dirección física.
*   **Código de Invitación Directo y Enlaces Sociales:** Invita roommates compartiendo el código manual o mediante enlaces de invitación directa de WhatsApp, Telegram o Facebook, con soporte para Web Share API en móviles.
*   **Unirse a un Hogar:** Ingresa el código o accede a través del link de invitación para unirte instantáneamente.

### 📅 2. Organización y Equidad en Tareas
*   **Catálogo de Tareas con Peso:** Asigna dificultades relativas a cada tarea de aseo.
*   **Algoritmo de Asignación Equitativa:** Distribuye las labores domésticas semanalmente de forma equitativa utilizando un algoritmo codicioso de empaquetado (greedy bin-packing).
*   **Evidencias con Fotografía:** Carga fotos de las tareas terminadas almacenándolas de forma segura en Amazon S3.

### 🏆 3. Pasaporte de Coexistencia (Reputación)
*   **Score Dinámico de Reputación:** Calificación en tiempo real de 0.0 a 5.0 estrellas según el cumplimiento de tareas domésticas.
*   **Currículum Permanente de Roommate:** Al mudarte o disolver un hogar, tu rol y reputación quedan registrados en tu historial de convivencia (`MembershipHistory`), sirviendo como tu "carta de presentación" para futuras casas.

### 🛡️ 4. Administración y Seguridad
*   **Expulsión de Miembros (Admin):** Los administradores pueden remover miembros que no cumplan las reglas.
*   **Disolución de Hogar (Admin):** Elimina de forma segura la casa y todos sus datos relacionados.
*   **Salida Voluntaria:** Los inquilinos pueden retirarse de un hogar cuando lo decidan resguardando su reputación.

### 🗺️ 5. Integración de Mapas y Direcciones
*   **Buscador Inteligente de Direcciones:** Autocompletado en tiempo real con debounce integrado a través de OpenStreetMap (Nominatim API).
*   **Mapas Interactivos:** Embebidos de Google Maps integrados en Marketplace y vistas del hogar.

### 🔑 6. Marketplace de Roommates y Postulaciones
*   **Publicar Habitación Disponible:** Anuncia cuartos especificando precio, depósito, fotos descriptivas y preferencias del hogar.
*   **Filtros Avanzados Premium:** Segmentación interactiva por precio, género preferido, mascotas y fumadores.
*   **Postulaciones y Contacto Rápido:** Postúlate ingresando tu contacto y envía mensajes directos de WhatsApp (`wa.me`) con un solo clic.

---

## 🛠️ Arquitectura y Estructura del Monorepo

Kimito se estructura en un monorepo altamente optimizado gestionado con Turborepo y pnpm.

```mermaid
graph TD
    subgraph Frontend [Cliente Web Next.js]
        A[Dashboard Component] --> B[Reputation Page]
        A --> C[Marketplace]
    end

    subgraph Backend [Core API NestJS]
        D[Auth Module]
        E[Houses Module]
        F[Tasks & Scheduling Module]
        G[Reputation Ledger]
        H[Notification Gateway]
    end

    subgraph Packages [Librerías Compartidas]
        I[shared-types]
    end

    Frontend -->|HTTP / Web Push| Backend
    Frontend -.->|Depende de| I
    Backend -.->|Depende de| I
```

### Distribución de Directorios
```
├── apps/
│   ├── web/          # Frontend Next.js (Desplegado en Vercel)
│   │                 # App Router, componentes de shadcn/ui, autenticación con Auth.js
│   └── api/          # Backend API NestJS (Desplegado en AWS Elastic Beanstalk)
│                     # Modular por funcionalidad: auth, houses, tasks, scheduling, reputation, listings
├── packages/
│   ├── shared-types/ # Tipos e interfaces de TypeScript compartidos
│   └── infra/        # Infraestructura como Código (IaC)
│       └── terraform/# Manifiestos de Terraform (RDS, S3, IAM, Elastic Beanstalk)
└── pnpm-workspace.yaml
```

---

## 🚀 Primeros Pasos

### Requisitos Previos
*   **Node.js** v20.x o superior
*   **pnpm** v10.x o superior (`npm install -g pnpm`)
*   **Docker & Docker Compose** (para PostgreSQL local)

### Proceso de Instalación

1. **Instalar dependencias locales:**
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno:**
   ```bash
   cp apps/api/.env.example apps/api/.env
   cp apps/web/.env.example apps/web/.env
   ```

3. **Iniciar base de datos PostgreSQL local:**
   ```bash
   docker compose up -d
   ```

4. **Sincronizar esquema de Prisma:**
   ```bash
   pnpm --filter api exec prisma db push
   ```

5. **Iniciar modo de desarrollo:**
   ```bash
   pnpm dev
   ```
   - Backend (NestJS): `http://localhost:3000`
   - Frontend (Next.js): `http://localhost:3001`

---

## 🐳 Docker

### Desarrollo (PostgreSQL)
```bash
docker compose up -d        # Levantar
docker compose down         # Detener
docker compose down -v      # Detener y limpiar volumen
```

### Producción (API)
```bash
docker build -t kimito-api -f apps/api/Dockerfile .
docker run -p 3000:3000 --env-file apps/api/.env kimito-api
```

---

## 📊 Endpoints del Marketplace

| Método | Ruta | Descripción |
|--------|------|-------------|
| `POST` | `/listings` | Crear publicación de habitación (Auth requerida) |
| `GET` | `/listings` | Listar publicaciones con filtros y paginación |
| `GET` | `/listings/:id` | Obtener una publicación |
| `PATCH` | `/listings/:id` | Editar publicación (solo dueño) |
| `DELETE` | `/listings/:id` | Eliminar publicación (solo dueño) |

---

## 👥 Integrantes

<p align="center">
  <strong>Emilio Escobedo (PatoCrazy2)</strong> &nbsp;•&nbsp; <strong>Herson Urdiales</strong>
</p>

---

## 📸 Galería y Capturas de Pantalla

<h3 align="center">Dashboard & Tareas</h3>
<p align="center">
  <img src="docs/screenshots/dashboard-tareas.PNG" width="30%" style="border-radius: 12px; margin: 5px;" alt="Dashboard" />
  <img src="docs/screenshots/gestor-tareas.PNG" width="30%" style="border-radius: 12px; margin: 5px;" alt="Gestor de Tareas" />
  <img src="docs/screenshots/tareas-catalogo.PNG" width="30%" style="border-radius: 12px; margin: 5px;" alt="Añadir Tarea" />
</p>

<h3 align="center">Mi Casa & Ubicaciones</h3>
<p align="center">
  <img src="docs/screenshots/mi-casa.PNG" width="30%" style="border-radius: 12px; margin: 5px;" alt="Miembros" />
  <img src="docs/screenshots/casa-detalle.PNG" width="30%" style="border-radius: 12px; margin: 5px;" alt="Detalles de Casa" />
  <img src="docs/screenshots/crear-hogar.PNG" width="30%" style="border-radius: 12px; margin: 5px;" alt="Crear Hogar" />
</p>

<h3 align="center">Marketplace de Roommates</h3>
<p align="center">
  <img src="docs/screenshots/marketplace-listing.PNG" width="45%" style="border-radius: 12px; margin: 5px;" alt="Publicación" />
  <img src="docs/screenshots/marketplace-edit.PNG" width="45%" style="border-radius: 12px; margin: 5px;" alt="Editar Anuncio" />
</p>

<h3 align="center">Perfil & Onboarding</h3>
<p align="center">
  <img src="docs/screenshots/perfil-reputacion.PNG" width="45%" style="border-radius: 12px; margin: 5px;" alt="Reputación" />
  <img src="docs/screenshots/onboarding.PNG" width="45%" style="border-radius: 12px; margin: 5px;" alt="Onboarding" />
</p>
