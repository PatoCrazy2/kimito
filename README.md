# Kimito - Sistema de Gestión de Limpieza de Áreas Comunes

Kimito es un monorepo para gestionar la limpieza de áreas comunes en casas compartidas. Permite repartir tareas de forma manual y automática, generar calendarios equitativos según el peso de cada labor, enviar notificaciones al completarlas, y mantener una reputación por usuario que sirve como carta de presentación al cambiar de casa. También incluye un marketplace para buscar o ser roommate.

## Estructura del Monorepo

Este proyecto está organizado como un monorepo usando **Turborepo** y **pnpm** como gestor de paquetes:

```
apps/
  web/          → Aplicación Frontend en Next.js 16 (desplegada en Vercel)
  api/          → API Backend en NestJS (desplegada vía Docker en AWS Elastic Beanstalk)
packages/
  shared-types/ → Tipos e interfaces de TypeScript compartidos entre frontend y backend
```

---

## Requisitos Previos

- **Node.js** v20 o superior
- **pnpm** v10 o superior instalado en tu máquina (`npm install -g pnpm`)

---

## Configuración Inicial

1. **Instalar dependencias del monorepo:**
   Ejecuta esto en la raíz del proyecto para descargar e instalar todas las dependencias y vincular localmente los paquetes:
   ```bash
   pnpm install
   ```

2. **Configurar variables de entorno:**
   Copia el archivo de ejemplo en el backend y rellena los valores requeridos en el nuevo archivo `.env`:
   ```bash
   cp apps/api/.env.example apps/api/.env
   ```

3. **Iniciar la base de datos local:**
   Levanta la base de datos PostgreSQL local en segundo plano usando Docker Compose:
   ```bash
   docker compose up -d
   ```

4. **Generar el Cliente de Prisma:**
   Genera los tipos del cliente Prisma a partir del esquema:
   ```bash
   pnpm --filter api exec prisma generate
   ```

---

## Desarrollo Local

Para levantar el frontend, el backend y compilar los tipos compartidos de manera simultánea en modo desarrollo:
```bash
pnpm dev
```

Esto iniciará:
- **Frontend (web):** `http://localhost:3000`
- **Backend (api):** `http://localhost:3001` (o el puerto configurado por NestJS)

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
   - Copia únicamente los archivos de producción compilados (`dist/`) y las dependencias de producción (`node_modules`), ignorando el código fuente y las herramientas de desarrollo. Esto reduce drásticamente el peso de la imagen final (de ~1GB a menos de 200MB).

### Comandos de Docker

> [!IMPORTANT]
> Debes ejecutar el comando de construcción de Docker **desde la raíz del monorepo** (no dentro de `apps/api`) para que Docker tenga acceso a la carpeta de `packages/`.

- **Para construir la imagen de Docker:**
  ```bash
  docker build -t kimito-api -f apps/api/Dockerfile .
  ```
  *(Nota el punto `.` al final, le indica a Docker que use la carpeta actual como contexto del monorepo).*

- **Para correr el contenedor localmente:**
  ```bash
  docker run -p 3000:3000 --env-file apps/api/.env kimito-api
  ```
  *(Esto mapeará el puerto 3000 del contenedor al puerto 3000 de tu máquina y le pasará las variables de entorno de tu archivo local).*
