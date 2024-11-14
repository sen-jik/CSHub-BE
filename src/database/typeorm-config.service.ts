import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { AllConfigType } from 'src/config';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
  constructor(private configService: ConfigService<AllConfigType>) {}

  createTypeOrmOptions(): TypeOrmModuleOptions {
    return {
      type: this.configService.get<string>('postgres.type', {
        infer: true,
      }),
      host: this.configService.get<string>('postgres.host', {
        infer: true,
      }),
      port: this.configService.get<number>('postgres.port', {
        infer: true,
      }),
      database: this.configService.get<string>('postgres.database', {
        infer: true,
      }),
      username: this.configService.get<string>('postgres.username', {
        infer: true,
      }),
      password: this.configService.get<string>('postgres.password', {
        infer: true,
      }),
      synchronize: this.configService.get<boolean>('postgres.synchronize', {
        infer: true,
      }),
      entities: [__dirname + '/../**/*.entity.{ts,js}'],
      dropSchema: false,
      keepConnectionAlive: true,
      logging: true,
    } as TypeOrmModuleOptions;
  }
}
