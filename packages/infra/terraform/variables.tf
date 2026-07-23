variable "aws_region" {
  description = "Región de AWS donde se desplegarán los recursos"
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Nombre del proyecto para prefijos de recursos"
  type        = string
  default     = "kimito"
}

variable "environment" {
  description = "Entorno del despliegue (dev, prod, staging)"
  type        = string
  default     = "production"
}

variable "db_username" {
  description = "Usuario administrador de la base de datos PostgreSQL"
  type        = string
  default     = "kimito_user"
}

variable "db_password" {
  description = "Contraseña del administrador de la base de datos PostgreSQL"
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Nombre de la base de datos"
  type        = string
  default     = "kimito_db"
}

variable "auth_secret" {
  description = "Secret utilizado por Auth.js"
  type        = string
  sensitive   = true
}

variable "google_client_id" {
  description = "Google OAuth Client ID"
  type        = string
}

variable "google_client_secret" {
  description = "Google OAuth Client Secret"
  type        = string
  sensitive   = true
}