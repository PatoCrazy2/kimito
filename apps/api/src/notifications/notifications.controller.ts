import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Request,
} from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { AuthGuard } from '../auth/auth.guard';
import type { SubscribePushDto } from '@kimito/shared-types';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get('vapid-public-key')
  getVapidPublicKey() {
    return this.notificationsService.getVapidPublicKey();
  }

  @UseGuards(AuthGuard)
  @Post('subscribe')
  async subscribe(@Request() req: any, @Body() dto: SubscribePushDto) {
    return this.notificationsService.saveSubscription(req.user.email, dto);
  }
}
