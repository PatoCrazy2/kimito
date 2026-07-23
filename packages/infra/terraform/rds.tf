data "aws_vpc" "default" {
  default = true
}

# Security Group para las instancias EC2 de Elastic Beanstalk
resource "aws_security_group" "eb_sg" {
  name        = "${var.project_name}-eb-sg-${var.environment}"
  description = "Security Group para las instancias de Elastic Beanstalk"
  vpc_id      = data.aws_vpc.default.id

  # Permitir todo el tráfico saliente
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-eb-sg"
  }
}

# Security Group para la base de datos RDS
resource "aws_security_group" "rds_sg" {
  name        = "${var.project_name}-rds-sg-${var.environment}"
  description = "Security Group para la base de datos RDS PostgreSQL"
  vpc_id      = data.aws_vpc.default.id

  # Permitir tráfico PostgreSQL (5432) ÚNICAMENTE desde el Security Group de Elastic Beanstalk
  ingress {
    description     = "Allow PostgreSQL access from EB instances"
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.eb_sg.id]
  }

  # NOTA: Para correr migraciones locales desde tu máquina, puedes agregar temporalmente 
  # una regla que permita tu dirección IP pública en el puerto 5432. 
  # NUNCA uses 0.0.0.0/0 aquí.

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# Instancia de base de datos RDS PostgreSQL (Capa Gratuita compatible)
resource "aws_db_instance" "postgres" {
  identifier             = "${var.project_name}-db-${var.environment}"
  allocated_storage      = 20
  max_allocated_storage   = 100
  engine                 = "postgres"
  engine_version         = "16"
  instance_class         = "db.t4g.micro"
  db_name                = var.db_name
  username               = var.db_username
  password               = var.db_password
  parameter_group_name   = "default.postgres16"
  skip_final_snapshot    = true
  publicly_accessible    = true # Es accesible públicamente pero el SG limita quién puede conectar

  vpc_security_group_ids = [aws_security_group.rds_sg.id]

  tags = {
    Name = "${var.project_name}-postgres"
  }
}

output "rds_hostname" {
  value       = aws_db_instance.postgres.address
  description = "El endpoint / hostname de la base de datos RDS"
}

output "rds_port" {
  value       = aws_db_instance.postgres.port
  description = "El puerto de la base de datos RDS"
}
