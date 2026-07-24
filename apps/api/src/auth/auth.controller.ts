import { Controller, Get, Post, Body, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common';
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

  @Post('register')
  async register(@Body() body: any): Promise<UserDto> {
    try {
      return await this.authService.registerWithCredentials(body);
    } catch (error: any) {
      console.error('Error en registro:', error);
      if (error.message === 'EmailAlreadyExists') {
        throw new HttpException('El correo ya está en uso', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException(error.message || 'Error en el registro', HttpStatus.INTERNAL_SERVER_ERROR);
    }

  }

  @Post('verify')
  async verify(@Body() body: any): Promise<UserDto> {
    try {
      return await this.authService.verifyCredentials(body);
    } catch (error: any) {
      if (error.message === 'InvalidCredentials') {
        throw new HttpException('Credenciales inválidas', HttpStatus.UNAUTHORIZED);
      }
      throw new HttpException('Error al verificar credenciales', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}
