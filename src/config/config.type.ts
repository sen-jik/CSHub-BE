import { AppConfig } from './app-config';
import { PostgresConfig } from 'src/database/config/postgres-config.type';

export type AllConfigType = {
  app: AppConfig;
  postgres: PostgresConfig;
};
