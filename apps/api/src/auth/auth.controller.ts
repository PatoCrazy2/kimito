import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { UserDto } from '@kimito/shared-types';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard)
  @Get('me')
  async getMe(@Request() req: any): Promise<UserDto> {
    const userPayload = req.user;
    return this.authService.validateOrCreateUser({
      email: userPayload.email,
      name: userPayload.name,
      picture: userPayload.picture || userPayload.image,
    });
  }
}
