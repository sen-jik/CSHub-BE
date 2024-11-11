import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { UserController } from './modules/user/presentation/user.controller';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { QuizModule } from './modules/quiz/quiz.module';
import { AuthModule } from './modules/auth/auth.module';
import appConfig from './config/app.config';
import postgresConfig from './database/config/postgres.config';
import swaggerConfig from './config/swagger.config';
import { PointHistoryModule } from './modules/point-history/point-history.module';
import { RankingModule } from './modules/ranking/ranking.module';

const logger = new Logger('DatabaseConnection');
logger.log(process.env.NODE_ENV);

const PostgresModule = TypeOrmModule.forRootAsync({
  useClass: TypeOrmConfigService,
  dataSourceFactory: async (options: DataSourceOptions) => {
    const dataSource = new DataSource(options);
    await dataSource.initialize();
    logger.log(`Database connected: ${options.type}:${options.database}`);
    return dataSource;
  },
});

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, postgresConfig, swaggerConfig],
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    PostgresModule,
    UserModule,
    QuizModule,
    AuthModule,
    RankingModule,
    PointHistoryModule,
  ],
  controllers: [AppController, UserController],
})
export class AppModule {}
