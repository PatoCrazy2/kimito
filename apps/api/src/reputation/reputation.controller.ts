import { Controller, Get, Param, UseGuards, Request } from '@nestjs/common';
import { ReputationService } from './reputation.service';
import { AuthGuard } from '../auth/auth.guard';

@Controller('reputation')
export class ReputationController {
  constructor(private readonly reputationService: ReputationService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMyReputation(@Request() req: any) {
    return this.reputationService.getMyReputation(req.user.email);
  }

  @Get('users/:userId')
  async getUserReputation(@Param('userId') userId: string) {
    return this.reputationService.getUserReputation(userId);
  }
}
