import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type {
  SubscribePushDto,
  PushNotificationPayload,
} from '@kimito/shared-types';
import * as webpush from 'web-push';

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {
    // Configurar claves VAPID al instanciar el servicio
    if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
      webpush.setVapidDetails(
        process.env.VAPID_SUBJECT || 'mailto:soporte@kimito.app',
        process.env.VAPID_PUBLIC_KEY,
        process.env.VAPID_PRIVATE_KEY,
      );
    }
  }

  /**
   * Guarda o actualiza la suscripción Web Push del usuario
   */
  async saveSubscription(email: string, dto: SubscribePushDto) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuario no encontrado');
    }

    return this.prisma.pushSubscription.upsert({
      where: { endpoint: dto.endpoint },
      update: {
        userId: user.id,
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
      },
      create: {
        userId: user.id,
        endpoint: dto.endpoint,
        p256dh: dto.keys.p256dh,
        auth: dto.keys.auth,
      },
    });
  }

  /**
   * Envía una notificación Web Push a un usuario específico
   */
  async sendNotificationToUser(
    userId: string,
    payload: PushNotificationPayload,
  ) {
    const subscriptions = await this.prisma.pushSubscription.findMany({
      where: { userId },
    });

    const pushPayload = JSON.stringify(payload);

    const sendPromises = subscriptions.map(async (sub) => {
      const pushSubscription = {
        endpoint: sub.endpoint,
        keys: {
          p256dh: sub.p256dh,
          auth: sub.auth,
        },
      };

      try {
        await webpush.sendNotification(pushSubscription, pushPayload);
      } catch (error: any) {
        // Si la suscripción ya no es válida (404/410), la eliminamos de la BD
        if (error.statusCode === 404 || error.statusCode === 410) {
          await this.prisma.pushSubscription.delete({ where: { id: sub.id } });
        }
      }
    });

    await Promise.all(sendPromises);
  }

  /**
   * Obtiene la VAPID Public Key para enviarla al navegador
   */
  getVapidPublicKey() {
    return { publicKey: process.env.VAPID_PUBLIC_KEY || '' };
  }
}
