# Rol de IAM para las instancias de EC2 ejecutadas por Elastic Beanstalk
resource "aws_iam_role" "eb_ec2_role" {
  name = "${var.project_name}-eb-ec2-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Adjuntar políticas administradas por AWS para Elastic Beanstalk
resource "aws_iam_role_policy_attachment" "eb_web_tier" {
  role       = aws_iam_role.eb_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWebTier"
}

resource "aws_iam_role_policy_attachment" "eb_multicontainer_docker" {
  role       = aws_iam_role.eb_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkMulticontainerDocker"
}

resource "aws_iam_role_policy_attachment" "eb_worker_tier" {
  role       = aws_iam_role.eb_ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AWSElasticBeanstalkWorkerTier"
}

# Política personalizada para permitir a Elastic Beanstalk leer y escribir en S3
resource "aws_iam_policy" "eb_s3_policy" {
  name        = "${var.project_name}-eb-s3-policy-${var.environment}"
  description = "Permite acceso de lectura y escritura al bucket de S3 del proyecto"

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:GetObject",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:ListBucket"
        ]
        Resource = [
          aws_s3_bucket.storage.arn,
          "${aws_s3_bucket.storage.arn}/*"
        ]
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eb_s3_attachment" {
  role       = aws_iam_role.eb_ec2_role.name
  policy_arn = aws_iam_policy.eb_s3_policy.arn
}

# Perfil de instancia que se le asigna a las instancias EC2 de EB
resource "aws_iam_instance_profile" "eb_ec2_profile" {
  name = "${var.project_name}-eb-ec2-profile-${var.environment}"
  role = aws_iam_role.eb_ec2_role.name
}

# --- Service Role para Elastic Beanstalk ---
# Este rol permite a Elastic Beanstalk interactuar con otros servicios de AWS
resource "aws_iam_role" "eb_service_role" {
  name = "${var.project_name}-eb-service-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "elasticbeanstalk.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eb_service" {
  role       = aws_iam_role.eb_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkEnhancedHealth"
}

resource "aws_iam_role_policy_attachment" "eb_service_managed" {
  role       = aws_iam_role.eb_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSElasticBeanstalkService"
}
