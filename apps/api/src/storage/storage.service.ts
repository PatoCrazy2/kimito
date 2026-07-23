import { Injectable, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class StorageService {
  private s3Client: S3Client | null = null;
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    // Si hay credenciales de S3, inicializamos el cliente de AWS
    if (process.env.AWS_S3_BUCKET && process.env.AWS_REGION) {
      this.s3Client = new S3Client({
        region: process.env.AWS_REGION,
      });
    }

    // Asegurarnos de que la carpeta local 'uploads' exista
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Sube un archivo de imagen (a S3 o al almacenamiento local)
   */
  async uploadFile(
    file: Express.Multer.File,
  ): Promise<{ url: string; key: string }> {
    if (!file) {
      throw new BadRequestException('No se ha proporcionado ningún archivo');
    }

    const fileExtension = path.extname(file.originalname) || '.jpg';
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${fileExtension}`;

    // Si S3 está configurado, subimos a AWS
    if (this.s3Client && process.env.AWS_S3_BUCKET) {
      const bucket = process.env.AWS_S3_BUCKET;
      const key = `evidences/${filename}`;

      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const url = `https://${bucket}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
      return { url, key };
    }

    // MODO LOCAL: Guardamos en la carpeta 'uploads' del backend
    const filePath = path.join(this.uploadDir, filename);
    fs.writeFileSync(filePath, file.buffer);

    // URL servida por el backend local
    const url = `http://localhost:3001/storage/files/${filename}`;
    return { url, key: filename };
  }

  /**
   * Obtiene la ruta física de un archivo local
   */
  getLocalFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }
}
