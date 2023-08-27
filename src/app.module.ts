import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EnvConfigurations } from 'config/env.config';
import { joiValidationSchema } from 'config/joi.validation';

import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfigurations],
      validationSchema: joiValidationSchema,
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get('DB_PORT'),
        username: configService.get('DB_USER'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize:
          configService.get('ENVIRONMENT') === 'production' ? false : true,
        autoLoadEntities: true,
      }),
      inject: [ConfigService],
    }),

    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
