import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

import { ErrorTypeORM } from 'src/common/interfaces/error-typeorm.interface';
import { PaginationDto } from '../../common/dtos/pagination.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { validate as isUUID } from 'uuid';
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
      const user = this.userRepository.create(createUserDto);
      const newUser = await this.userRepository.save(user);
      delete newUser.password;
      return newUser;
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

  async findOne(term: string): Promise<UserResponse> {
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

    delete user.password;
    return {
      message: 'Successfully created user',
    };
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

      delete user.password;
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
    updateUserDto: UpdateUserDto,
  ): Promise<UserResponse> {
    // TODO: required admin password
    const user = await this.userRepository.preload({
      id: id,
      password: updateUserDto.password,
    });

    if (!user) throw new NotFoundException(`User with id: ${id} not found`);

    try {
      await this.userRepository.save(user);

      delete user.password;
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
