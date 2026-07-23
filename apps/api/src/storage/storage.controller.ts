import {
  Controller,
  Post,
  Get,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from './storage.service';
import { AuthGuard } from '../auth/auth.guard';
import type { Response } from 'express';
import * as fs from 'fs';

@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @UseGuards(AuthGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.storageService.uploadFile(file);
  }

  @Get('files/:filename')
  async getFile(@Param('filename') filename: string, @Res() res: Response) {
    const filePath = this.storageService.getLocalFilePath(filename);

    if (!fs.existsSync(filePath)) {
      throw new NotFoundException('Archivo no encontrado');
    }

    return res.sendFile(filePath);
  }
}
