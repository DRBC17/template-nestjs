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

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create(createUserDto);
      const user = await this.userRepository.save(newUser);
      delete user.password;
      return user;
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

  async findOneById(id: string): Promise<User> {
    try {
      const user = await this.userRepository.findOneBy({ id });
      delete user.password;
      if (!user) throw new NotFoundException(`User with id ${id} not found`);
      return user;
    } catch (error) {
      this.handleDataBaseErrors(error);
    }
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto); //TODO: remove
    return `This action updates a #${id} user`;
  }

  async changeState(id: string) {
    try {
      const userFound = await this.findOneById(id);

      const user = await this.userRepository.update(id, {
        isActive: !userFound.isActive,
      });
      return {
        message: `User with id ${id} is now ${
          userFound.isActive ? 'inactive' : 'active'
        }`,
        user,
      };
    } catch (error) {
      this.handleDataBaseErrors(error);
    }
  }

  private handleDataBaseErrors(error: ErrorTypeORM): never {
    this.logger.error(error);

    if (error.code === '23505') throw new BadRequestException(error.detail);

    if (error.code === 'error-404') throw new NotFoundException(error.detail);

    throw new InternalServerErrorException('Internal Server Error');
  }
}
