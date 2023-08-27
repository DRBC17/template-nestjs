import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EnvConfigurations } from 'config/env.config';
import { joiValidationSchema } from 'config/joi.validation';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [EnvConfigurations],
      validationSchema: joiValidationSchema,
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
