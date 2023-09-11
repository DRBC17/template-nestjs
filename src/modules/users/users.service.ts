import {
  Injectable,
  Logger,
  NotFoundException,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isUUID } from 'class-validator';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { ErrorTypeORM } from '../../common/interfaces/error-typeorm.interface';
import { PaginationDto } from '../../common/dtos';

import { CreateUserDto, UpdateUserDto, UpdatePasswordDto } from './dto';
import { User } from './entities/user.entity';
import { UserResponse } from './interfaces/user-response.interface';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10),
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        message: 'Successfully created user',
      };
    } catch (error) {
      this.handleDataBaseErrors(error);
    }
  }

  async findAll(paginationDto: PaginationDto): Promise<User[]> {
    try {
      const { limit = 10, offset = 0 } = paginationDto;

      return this.userRepository.find({
        take: limit,
        skip: offset,
        //TODO: relations: ['role']
      });
    } catch (error) {
      this.handleDataBaseErrors(error);
    }
  }

  async findOne(term: string): Promise<User> {
    let user: User;
    if (isUUID(term)) {
      user = await this.userRepository.findOneBy({ id: term });
    } else {
      const queryBuilder = this.userRepository.createQueryBuilder();
      user = await queryBuilder
        .where(`"username" =:username or LOWER("fullName") =:fullName`, {
          username: term.toLowerCase(),
          fullName: term.toLowerCase(),
        })
        .getOne();
    }

    if (!user) throw new NotFoundException(`User with term ${term} not found`);

    return user;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    delete updateUserDto.password;
    delete updateUserDto.username;
    const user = await this.userRepository.preload({
      id: id,
      ...updateUserDto,
    });

    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    try {
      await this.userRepository.save(user);

      // TODO Pendiente por revisar
      // delete user.password;
      return {
        message: `User with username: ${user.username} is updated`,
        user,
      };
    } catch (error) {
      this.handleDataBaseErrors(error);
    }
  }

  async updatePassword(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    // TODO: required admin password

    const { password } = updatePasswordDto;
    const user = await this.userRepository.preload({
      id: id,
      password: bcrypt.hashSync(password, 10),
    });

    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    try {
      await this.userRepository.save(user);

      // TODO Pendiente por revisar
      // delete user.password;
      return {
        message: `${user.username} password updated`,
      };
    } catch (error) {
      this.handleDataBaseErrors(error);
    }
  }

  async updateState(id: string, isActive: boolean): Promise<UserResponse> {
    const user = await this.userRepository.preload({
      id: id,
      isActive,
    });

    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    await this.userRepository.save(user);
    return {
      message: `User with id: ${id} is now ${
        user.isActive ? 'active' : 'inactive'
      }`,
    };
  }

  private handleDataBaseErrors(error: ErrorTypeORM): never {
    if (error.code === '23505') throw new BadRequestException(error.detail);

    // if (error.code === 'error-404') throw new NotFoundException(error.detail);
    this.logger.error(error);

    throw new InternalServerErrorException('Internal Server Error');
  }
}
