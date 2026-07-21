# Contexto del proyecto

App web para gestionar el aseo de áreas comunes en una casa compartida. Reparte
tareas de forma manual y automática, genera calendarios equitativos según el
peso de cada tarea, notifica al completar labores, y mantiene una reputación
por usuario que sirve como "carta de presentación" al cambiar de casa. Incluye
un marketplace de ofertas para buscar roommate o ser roommate.

Proyecto de hackathon de 2 días. Prioridad: que el MVP funcione de punta a
punta, sin sobre-ingeniería.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui |
| Frontend hosting | Vercel |
| Backend | NestJS (TypeScript) |
| Backend hosting | Docker → AWS Elastic Beanstalk |
| ORM | Prisma |
| Base de datos | Amazon RDS (PostgreSQL) |
| Almacenamiento | Amazon S3 (evidencias de tareas, avatares, fotos de marketplace) |
| Notificaciones | Web Push (VAPID) — sin servicios de terceros |
| Autenticación | Google OAuth vía Auth.js (Next.js) + verificación JWT en NestJS |
| IaC | Terraform (recursos mínimos, sin VPC custom) |
| Monorepo | Turborepo |

## Arquitectura

Monorepo:

```
apps/
  web/    → Next.js (Vercel)
  api/    → NestJS (Docker → Elastic Beanstalk)
packages/
  shared-types/  → DTOs e interfaces compartidas web ↔ api
  infra/
    terraform/   → rds.tf, s3.tf, eb.tf, iam.tf
    docker/      → Dockerfile de api
```

`apps/api/src/` se organiza **por feature**, no por capas (nada de
`domain/application/infrastructure` separados). Cada módulo NestJS es
autocontenido: controller, service, dto.

## Responsabilidades por módulo (apps/api/src/)

- `auth/` — validación de JWT emitido por Auth.js (Google OAuth), guards.
- `houses/` — casas compartidas y sus miembros.
- `tasks/` — tareas de aseo y su peso.
- `scheduling/` — algoritmo de reparto equitativo (cron job para asignación
  automática, endpoint para overrides manuales).
- `reputation/` — cálculo del score por historial de cumplimiento; perfil
  público consultable al aplicar a otra casa.
- `listings/` — marketplace: publicar y ver ofertas de roommate.
- `notifications/` — envío de Web Push (VAPID) al completar/vencer tareas,
  invitaciones e solicitudes.
- `storage/` — subida de archivos a S3.

## Decisiones ya tomadas (no las cuestiones sin que el equipo lo pida)

- Backend en NestJS, no .NET ni FastAPI.
- Notificaciones: Web Push nativo, no OneSignal ni Firebase.
- AWS mínimo: RDS + S3 + Elastic Beanstalk + IAM, sin VPC custom ni NAT
  gateway — RDS con security group restringido solo al SG de Elastic
  Beanstalk.
- Terraform con state local (no remote backend) para el alcance del
  hackathon.
