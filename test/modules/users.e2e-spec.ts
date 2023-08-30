import * as request from 'supertest';
import { INestApplication, Logger } from '@nestjs/common';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TestingModule, Test } from '@nestjs/testing';
import { UsersModule } from '../../src/modules/users/users.module';
import { User } from '../../src/modules/users/entities/user.entity';
import { Repository } from 'typeorm';

describe('UsersController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<User>;
  const user: User = {
    fullName: 'e2e_fullName',
    username: 'e2e_username',
    password: 'e2e_password',
    // roles: ['user'],
    // isActive: true,
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
          database: 'template_cms_db_test_e2e',
          entities: [User],
          synchronize: true,
        }),
        UsersModule,
      ],
    })
      .setLogger(new Logger())
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get<Repository<User>>(getRepositoryToken(User));

    repository.clear();
  });

  describe('POST /users/create', () => {
    test('should create a user', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send(user)
        .set('Accept', 'application/json');

      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
      expect(response.status).toBe(201);
    });

    test('should return an error if the user already exists', async () => {
      const response = await request(app.getHttpServer())
        .post('/users/create')
        .send(user)
        .set('Accept', 'application/json');

      expect(response.headers['content-type']).toEqual(
        expect.stringContaining('json'),
      );
      expect(response.status).toBe(400);
      expect(response.body).toBeInstanceOf(Object);
      expect(response.body['message']).toBe(
        'Key (username)=(e2e_username) already exists.',
      );
    });
  });

  describe('GET /users', () => {
    test('should return an array of users', async () => {
      const response = await request(app.getHttpServer()).get('/users');

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
