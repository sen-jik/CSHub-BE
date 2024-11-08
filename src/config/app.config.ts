import { registerAs } from '@nestjs/config';
import validateConfig from 'src/utils/validate-config';
import { IsEnum, IsOptional } from 'class-validator';
import { AppConfig } from './app-config';

enum Environment {
  Development = 'development',
  Production = 'production',
  Local = 'local',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;
}

export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);
  return {
    nodeEnv: process.env.NODE_ENV || 'development',
  };
});
