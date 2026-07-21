---
trigger: always_on
---

Backend (NestJS)
Cada módulo vive en apps/api/src/<feature>/ con su controller, service, dto y module — sin subcarpetas de capas adicionales.
Acceso a base de datos siempre a través de Prisma (prisma/schema.prisma), nunca SQL crudo salvo que el equipo lo pida explícitamente.
La conexión a base de datos se configura únicamente vía la variable de entorno DATABASE_URL — nunca hardcodees credenciales de RDS.
Autenticación: el guard de auth/ valida el JWT emitido por Auth.js (Google OAuth) usando el secreto compartido — no implementes un flujo OAuth propio dentro de NestJS.
Notificaciones: usa la librería web-push con claves VAPID desde el módulo notifications/ — no integres SDKs de terceros (OneSignal, Firebase) salvo que el equipo lo decida.
Subida de archivos: siempre a través del módulo storage/ hacia S3, nunca al filesystem local del contenedor (Elastic Beanstalk no garantiza persistencia de disco entre despliegues).
El algoritmo de reparto equitativo vive en scheduling/ y debe quedar aislado del controller — que sea testeable sin necesidad de HTTP.