import * as bcrypt from 'bcrypt';
import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/login-user.dto';

import { User } from '../users/entities/user.entity';
import { AuthResponse, JwtPayload } from './interfaces';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginUserDto: LoginUserDto): Promise<AuthResponse> {
    const { username, password } = loginUserDto;

    const user = await this.userRepository.findOne({
      where: { username },
      select: { id: true, username: true, password: true },
    });

    if (!user) throw new UnauthorizedException('Credentials are not valid');

    if (!bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credentials are not valid');

    delete user.password;
    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  async revalidateToken(user: User): Promise<AuthResponse> {
    delete user.password;
    return {
      user,
      token: this.getJwtToken({ id: user.id }),
    };
  }

  private getJwtToken(payload: JwtPayload): string {
    return this.jwtService.sign(payload);
  }

  private handleDataBaseErrors(error: any): never {
    this.logger.error(error);
    throw new InternalServerErrorException('Internal Server Error');
  }
}
