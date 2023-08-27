import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';

describe('UsersController', () => {
  let usersController: UsersController;
  // let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    usersController = module.get<UsersController>(UsersController);
    // usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  // describe('findAll', () => {
  //   it('should return an array of users', async () => {
  //     const users = [
  //       {
  //         fullName: 'fullName',
  //         username: 'username',
  //         password: 'password',
  //         id: 'id',
  //         roles: ['user'],
  //         isActive: true,
  //       },
  //     ];
  //     jest.spyOn(usersService, 'findAll').mockResolvedValue(users);

  //     expect(await usersController.findAll()).toBe(users);
  //   });
  // });
});
