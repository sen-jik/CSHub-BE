import { registerAs } from '@nestjs/config';
import { IsString } from 'class-validator';
import validateConfig from 'src/utils/validate-config';
import { SwaggerConfig } from '../types/swagger-config.type';

class EnvironmentVariablesValidator {
  @IsString()
  SWAGGER_USER: string;

  @IsString()
  SWAGGER_PASSWORD: string;
}

export default registerAs<SwaggerConfig>('swagger', async () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    user: process.env.SWAGGER_USER,
    password: process.env.SWAGGER_PASSWORD,
  };
});
