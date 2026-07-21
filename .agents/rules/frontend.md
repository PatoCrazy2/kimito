---
trigger: always_on
---

App Router únicamente (app/), no Pages Router.
Autenticación con Auth.js (Google OAuth). El JWT de la sesión se reenvía como Bearer token en cada llamada a la API de NestJS — no dupliques lógica de sesión ni guardes tokens en localStorage.
UI con Tailwind CSS y componentes de shadcn/ui — no introduzcas otra librería de componentes (Material UI, Chakra, etc.).
Tipos e interfaces que también use el backend van en packages/shared-types, nunca duplicados localmente en apps/web.
Este frontend se despliega en Vercel — no agregues configuración pensada para otro proveedor (Docker, EB, etc.) en apps/web.