import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { AuthResponse } from './interfaces';
import { Auth, GetUser } from './decorators';
import { User } from '../users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return this.authService.login(loginUserDto);
  }

  @Get('/revalidate-token')
  @Auth()
  revalidateToken(@GetUser() user: User): Promise<AuthResponse> {
    return this.authService.revalidateToken(user);
  }
}
