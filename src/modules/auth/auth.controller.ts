import { Controller, Post, Body, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto';
import { AuthResponse } from './interfaces';
import { Auth, GetUser } from './decorators';
import { User } from '../users/entities/user.entity';
import {
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@ApiUnauthorizedResponse({
  description: 'Unauthorized.',
})
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @ApiOperation({ summary: 'Login user' })
  @ApiCreatedResponse({
    description: 'Login successful.',
  })
  login(@Body() loginUserDto: LoginUserDto): Promise<AuthResponse> {
    return this.authService.login(loginUserDto);
  }

  @Get('/revalidate-token')
  @Auth()
  @ApiOperation({ summary: 'Revalidate token' })
  @ApiResponse({
    status: 200,
    description: 'Revalidate token successful.',
  })
  revalidateToken(@GetUser() user: User): Promise<AuthResponse> {
    return this.authService.revalidateToken(user);
  }
}
