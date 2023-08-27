import * as Joi from 'joi';

export const joiValidationSchema = Joi.object({
  ENVIRONMENT: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET_KEY: Joi.required(),
  JWT_EXPIRATION_TIME: Joi.string().default('4h'),

  DB_USER: Joi.required(),
  DB_PASSWORD: Joi.required(),
  DB_HOST: Joi.required(),
  DB_NAME: Joi.required(),
  DB_PORT: Joi.number().default(5432),
});
