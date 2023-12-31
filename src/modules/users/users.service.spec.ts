import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let usersService: UsersService;
  let userRepository: Repository<User>;

  const userData: User = {
    fullName: 'fullName',
    username: 'username',
    password: 'password',
    checkFieldsBeforeInsert() {
      this.username = this.username.toLowerCase().trim();
    },
    checkFieldsBeforeUpdate() {
      this.checkFieldsBeforeInsert();
    },
  };

  const createdUser: User = {
    fullName: 'fullName',
    username: 'username',
    password: 'password',
    id: 'id',
    roles: ['user'],
    isActive: true,
    checkFieldsBeforeInsert() {
      this.username = this.username.toLowerCase().trim();
    },
    checkFieldsBeforeUpdate() {
      this.checkFieldsBeforeInsert();
    },
  };

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    userRepository = moduleRef.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a user', async () => {
      jest.spyOn(userRepository, 'create').mockReturnValue(userData);
      jest.spyOn(userRepository, 'save').mockResolvedValue(createdUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const users: User[] = [userData];
      jest.spyOn(userRepository, 'find').mockResolvedValue(users);

      expect(await usersService.findAll({})).toBe(users);
    });
  });
});
