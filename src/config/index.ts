import { AppConfig } from './types/app-config.type';
import { PostgresConfig } from 'src/database/config/postgres-config.type';
import { AuthConfig } from './types/auth-config.type';
import { SwaggerConfig } from './types/swagger-config.type';

export type AllConfigType = {
  app: AppConfig;
  postgres: PostgresConfig;
  swagger: SwaggerConfig;
  auth: AuthConfig;
};
