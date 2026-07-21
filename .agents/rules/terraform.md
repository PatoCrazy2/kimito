---
trigger: always_on
---

Usa la VPC default de la cuenta — no crees una VPC custom, subredes privadas ni NAT gateway. No hay tiempo en 2 días para esa complejidad.
RDS puede tener acceso público, pero el security group debe permitir tráfico únicamente desde el security group de Elastic Beanstalk — nunca 0.0.0.0/0 en el puerto de PostgreSQL.
El backend se despliega en Elastic Beanstalk (no EC2 directo, no ECS/EKS).
El state de Terraform es local para este proyecto — no configures un backend remoto (S3 state bucket, DynamoDB lock table). Asegúrate de que *.tfstate esté en .gitignore.
Solo crea los recursos que el proyecto usa: RDS, S3, Elastic Beanstalk (aplicación + entorno), e IAM roles/policies necesarios para que EB pueda acceder a S3 y RDS. No generalices en módulos reutilizables.
Orden de trabajo recomendado: si algo bloquea el avance, despliega el recurso manualmente desde la consola/CLI de AWS primero, y sincroniza Terraform después (import o recrear) — no bloquees el desarrollo del producto esperando que el IaC esté perfecto.