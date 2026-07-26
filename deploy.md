# Plan de Despliegue en Producción — Kimito

Este documento describe la estrategia y los pasos a seguir para realizar el despliegue del ecosistema **Kimito** de punta a punta: la infraestructura en AWS (RDS PostgreSQL, S3 y Elastic Beanstalk) mediante Terraform, el despliegue de la API NestJS y la base de datos, y el despliegue de la app frontend en Vercel.

---

## Tiempo Estimado del Despliegue

> **Tiempo Total Estimado:** **30 a 45 minutos**
> - **Instalación rápida de herramientas (AWS CLI / Terraform) o AWS Console:** ~5 a 10 min.
> - **Aprovisionamiento IaC en AWS (Terraform / RDS / Elastic Beanstalk):** ~10 a 15 min *(la creación de la instancia RDS PostgreSQL en AWS toma unos 7-10 min automáticos)*.
> - **Despliegue de Backend NestJS & Migración Prisma:** ~5 a 10 min.
> - **Despliegue del Frontend Next.js en Vercel:** ~5 min.

---

## User Review & Questions Resolved

> [!NOTE]
> 1. **¿Están ya hechos los archivos de Terraform necesarios?**
>    **Sí, están 100% completos.** En `packages/infra/terraform/` ya contamos con los archivos necesarios (`main.tf`, `rds.tf`, `s3.tf`, `eb.tf`, `iam.tf`, `variables.tf`).
> 
> 2. **Plantilla de variables creada:**
>    Se ha creado el archivo de plantilla [terraform.tfvars.example](file:///c:/kimito/packages/infra/terraform/terraform.tfvars.example) en el proyecto. Solo hará falta duplicarlo como `terraform.tfvars` e ingresar tus credenciales/secretos reales.
> 
> 3. **Herramientas de CLI (AWS / Terraform / Vercel):**
>    Como no las tienes instaladas localmente todavía, instalaremos rápidamente `awscli` y `terraform` usando PowerShell (`winget install HashiCorp.Terraform` y `winget install Amazon.AWSCLI`) o realizaremos los pasos correspondientes guiados.


---

## Proposed Changes

El proceso de despliegue se dividirá en 5 fases secuenciales:

---

### Fase 1: Aprovisionamiento de Infraestructura con Terraform

Se utilizarán los archivos existentes en `packages/infra/terraform/`.

#### Pasos de ejecución:
1. Crear el archivo de variables locales `packages/infra/terraform/terraform.tfvars` (ignorado en `.gitignore` por seguridad).
2. Ejecutar la inicialización y validación de Terraform:
   ```bash
   cd packages/infra/terraform
   terraform init
   terraform plan -out=tfplan
   terraform apply tfplan
   ```
3. Obtener las salidas (Outputs) de Terraform:
   - Endpoint de RDS PostgreSQL
   - CNAME / URL pública del entorno de Elastic Beanstalk (`https://kimito-env-production.us-east-1.elasticbeanstalk.com` o similar)
   - Nombre del bucket de S3 generado

---

### Fase 2: Ejecución de Migraciones de Base de Datos (Prisma RDS)

Una vez disponible la instancia RDS PostgreSQL:
1. Construir la URL de conexión de producción a RDS (`DATABASE_URL`).
2. Ejecutar la sincronización/migración de esquemas Prisma desde la raíz del monorepo hacia RDS:
   ```bash
   pnpm --filter api exec prisma db push
   ```

---

### Fase 3: Despliegue de la API NestJS en AWS Elastic Beanstalk

Se utilizará la imagen Docker generada por el `Dockerfile` optimizado en `apps/api/Dockerfile`.

#### Pasos de ejecución:
1. Generar el paquete de despliegue para Elastic Beanstalk (`Dockerrun.aws.json` o paquete Zip comprimido del monorepo/Docker build).
2. Desplegar la aplicación al entorno de Elastic Beanstalk creado en la Fase 1 mediante EB CLI (`eb deploy`) o la Consola de AWS / AWS CLI.
3. Verificar la salud del entorno (*Enhanced Health*) y el endpoint de estado de la API.

---

### Fase 4: Despliegue del Frontend Next.js en Vercel

Se desplegará la aplicación web en Vercel conectada con la API de Elastic Beanstalk.

#### Configuración en Vercel (`apps/web`):
1. **Framework Preset:** Next.js
2. **Root Directory:** `apps/web`
3. **Variables de entorno en Vercel:**
   - `NEXT_PUBLIC_API_URL`: URL pública asignada a la API en Elastic Beanstalk (obtenida en Fase 1).
   - `AUTH_SECRET`: Secreto único para firmas de Auth.js.
   - `AUTH_GOOGLE_ID`: Client ID de Google OAuth.
   - `AUTH_GOOGLE_SECRET`: Client Secret de Google OAuth.
   - `NEXTAUTH_URL`: URL del dominio asignado por Vercel.

---

### Fase 5: Verificación de Integración End-to-End

Pruebas manuales post-despliegue:
- [ ] Autenticación vía Google OAuth en la aplicación desplegada en Vercel.
- [ ] Creación de una casa y registro de miembros.
- [ ] Asignación de tareas y ejecución del algoritmo de reparto equitativo.
- [ ] Subida de evidencias de tareas a Amazon S3 y verificación de renderizado de la imagen.
- [ ] Verificación del pasaporte de reputación y notificaciones Web Push.

---

## Verification Plan

### Automated Verification
- `pnpm build`: Verificar que todo el monorepo compila localmente antes de enviar el código.
- `terraform validate`: Confirmar la validez de los manifiestos IaC.

### Manual Verification
- Comprobar disponibilidad HTTP (status 200) de los endpoints de la API en Elastic Beanstalk.
- Iniciar sesión en la app de Vercel y completar el flujo completo de una tarea.
