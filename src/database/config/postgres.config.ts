import { registerAs } from '@nestjs/config';
import { PostgresConfig } from './postgres-config.type';
import {
  IsOptional,
  IsInt,
  Min,
  Max,
  IsString,
  IsBoolean,
} from 'class-validator';
import validateConfig from 'src/utils/validate-config';

class EnvironmentVariablesValidator {
  @IsString()
  DATABASE_TYPE: string;

  @IsString()
  POSTGRES_HOST: string;

  @IsInt()
  @Min(0)
  @Max(65535)
  POSTGRES_PORT: number;

  @IsString()
  POSTGRES_PASSWORD: string;

  @IsString()
  POSTGRES_USERNAME: string;

  @IsString()
  POSTGRES_DATABASE: string;

  @IsBoolean()
  @IsOptional()
  POSTGRES_SYNCHRONIZE: boolean;
}

export default registerAs<PostgresConfig>('postgres', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    type: process.env.DATABASE_TYPE,
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT, 10),
    database: process.env.POSTGRES_DATABASE,
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    synchronize: process.env.POSTGRES_SYNCHRONIZE === 'true',
  };
});
