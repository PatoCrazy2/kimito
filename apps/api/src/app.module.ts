import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { HousesModule } from './houses/houses.module';
import { TasksModule } from './tasks/tasks.module';
import { SchedulingModule } from './scheduling/scheduling.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ReputationModule } from './reputation/reputation.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    AuthModule,
    HousesModule,
    TasksModule,
    SchedulingModule,
    NotificationsModule,
    ReputationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
