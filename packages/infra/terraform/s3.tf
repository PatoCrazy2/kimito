resource "aws_s3_bucket" "storage" {
  bucket        = "${var.project_name}-storage-${var.environment}"
  force_destroy = true
}

# Permitir lectura pública y configuración CORS para acceso directo desde el frontend
resource "aws_s3_bucket_public_access_block" "storage_public_block" {
  bucket = aws_s3_bucket.storage.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_s3_bucket_policy" "public_read" {
  depends_on = [aws_s3_bucket_public_access_block.storage_public_block]
  bucket     = aws_s3_bucket.storage.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.storage.arn}/*"
      }
    ]
  })
}

resource "aws_s3_bucket_cors_configuration" "storage_cors" {
  bucket = aws_s3_bucket.storage.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST", "DELETE", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

output "s3_bucket_name" {
  value       = aws_s3_bucket.storage.id
  description = "Nombre del bucket de S3 creado"
}
