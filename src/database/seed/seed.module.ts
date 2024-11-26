import { Module } from '@nestjs/common';
import { CategorySeedModule } from './category/category-seed.module';
import { ConfigModule } from '@nestjs/config';
import postgresConfig from '../config/postgres.config';
import appConfig from 'src/config/modules/app.config';
import { DataSourceOptions } from 'typeorm';
import { TypeOrmConfigService } from '../typeorm-config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Module({
  imports: [
    CategorySeedModule,
    ConfigModule.forRoot({
      isGlobal: true,
      load: [postgresConfig, appConfig],
      envFilePath: [`.env.${process.env.NODE_ENV}`],
    }),
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
      dataSourceFactory: async (options: DataSourceOptions) => {
        return new DataSource(options).initialize();
      },
    }),
  ],
})
export class SeedModule {}
