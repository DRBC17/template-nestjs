export const EnvConfigurations = () => ({
  ENVIRONMENT: process.env.ENVIRONMENT,
  PORT: +process.env.PORT,
  JWT_SECRET_KEY: process.env.JWT_SECRET_KEY,
  JWT_EXPIRATION_TIME: process.env.JWT_EXPIRATION_TIME,
  DB_USER: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_PASSWORD,
  DB_HOST: process.env.DB_HOST,
  DB_NAME: process.env.DB_NAME,
  DB_PORT: +process.env.DB_PORT,
});
