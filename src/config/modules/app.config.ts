import { registerAs } from '@nestjs/config';
import validateConfig from 'src/utils/validate-config';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { AppConfig } from '../types/app-config.type';

enum Environment {
  Development = 'development',
  Production = 'production',
  Local = 'local',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsNumber()
  PORT: number;

  @IsString()
  CLIENT_URL: string;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    port: parseInt(process.env.PORT) || 4000,
    clientUrl: process.env.CLIENT_URL,
  };
});
