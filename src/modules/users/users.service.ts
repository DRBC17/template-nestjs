import * as bcrypt from 'bcrypt';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ErrorTypeORM } from 'src/core/interfaces/error-typeorm.interface';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger('UsersService');

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const newUser = this.userRepository.create({
        ...createUserDto,
        password: bcrypt.hashSync(createUserDto.password, 10),
      });
      return await this.userRepository.save(newUser);
    } catch (error) {
      this.handleDataBaseErrors(error);
    }
  }

  async findAll(): Promise<User[]> {
    try {
      // TODO: filtrar, paginar, por usuario
      return this.userRepository.find();
    } catch (error) {
      this.handleDataBaseErrors(error);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    console.log(updateUserDto); //TODO: remove
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  private handleDataBaseErrors(error: ErrorTypeORM): never {
    this.logger.error(error);

    if (error.code === '23505') throw new BadRequestException(error.detail);

    if (error.code === 'error-404') throw new NotFoundException(error.detail);

    throw new InternalServerErrorException('Internal Server Error');
  }
}
