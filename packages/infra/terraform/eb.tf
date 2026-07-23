# Aplicación de Elastic Beanstalk
resource "aws_elastic_beanstalk_application" "app" {
  name        = var.project_name
  description = "Aplicación Elastic Beanstalk para ${var.project_name}"
}

# Entorno de Elastic Beanstalk para la API Backend en Docker
resource "aws_elastic_beanstalk_environment" "env" {
  name                = "${var.project_name}-env-${var.environment}"
  application         = aws_elastic_beanstalk_application.app.name
  solution_stack_name = "64bit Amazon Linux 2023 v4.13.4 running Docker"

  # Configuración del Instance Profile de EC2
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "IamInstanceProfile"
    value     = aws_iam_instance_profile.eb_ec2_profile.name
  }

  # Configuración de tipo de instancia
  setting {
    namespace = "aws:autoscaling:launchconfiguration"
    name      = "InstanceType"
    value     = "t3.micro"
  }

  # Service Role de Elastic Beanstalk
  setting {
    namespace = "aws:elasticbeanstalk:environment"
    name      = "ServiceRole"
    value     = aws_iam_role.eb_service_role.arn
  }

  # Variables de entorno
  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "NODE_ENV"
    value     = "production"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "PORT"
    value     = "3000"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "DATABASE_URL"
    value     = "postgresql://${var.db_username}:${var.db_password}@${aws_db_instance.postgres.endpoint}/${var.db_name}?schema=public"
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AUTH_SECRET"
    value     = var.auth_secret
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_REGION"
    value     = var.aws_region
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "AWS_S3_BUCKET"
    value     = aws_s3_bucket.storage.id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "GOOGLE_CLIENT_ID"
    value     = var.google_client_id
  }

  setting {
    namespace = "aws:elasticbeanstalk:application:environment"
    name      = "GOOGLE_CLIENT_SECRET"
    value     = var.google_client_secret
  }

  # Habilitar actualizaciones de salud mejoradas
  setting {
    namespace = "aws:elasticbeanstalk:healthreporting:system"
    name      = "SystemType"
    value     = "enhanced"
  }
}

output "eb_cname" {
  value       = aws_elastic_beanstalk_environment.env.cname
  description = "URL pública asignada por Elastic Beanstalk para acceder a la API"
}