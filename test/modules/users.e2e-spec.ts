import * as request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersModule } from '../../src/modules/users/users.module';
import { User } from '../../src/modules/users/entities/user.entity';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  const globalPrefix = 'http://localhost:3000/api';
  const user: User = {
    fullName: 'fullName',
    username: 'username',
    password: 'password',
    roles: ['user'],
    isActive: true,
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'postgres1234',
          database: 'template_cms_db',
          entities: [User],
          synchronize: true,
        }),
        UsersModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('POST /users/create', () => {
    test('should create a user', async () => {
      const response = await request(globalPrefix)
        .post('/users/create')
        .send(user)
        .set('Accept', 'application/json');

      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
      expect(response.status).toBe(201);
    });
    // test('should return an error if the user already exists', async () => {
    //   const response = await request(globalPrefix)
    //     .post('/users/create')
    //     .send(userMock);

    //   expect(response.status).toBe(400);
    // });
  });

  describe('GET /users', () => {
    test('should return an array of users', async () => {
      const response = await request(globalPrefix).get('/users');

      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
    });
  });

  afterAll(async () => {
    await app?.close();
  });
});