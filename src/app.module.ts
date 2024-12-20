import { Logger, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UserModule } from './modules/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmConfigService } from './database/typeorm-config.service';
import { DataSource } from 'typeorm';
import { DataSourceOptions } from 'typeorm';
import { ConfigModule } from '@nestjs/config';
import { QuizModule } from './modules/quiz/quiz.module';
import { AuthModule } from './modules/auth/auth.module';
import appConfig from './config/modules/app.config';
import postgresConfig from './database/config/postgres.config';
import { PointModule } from './modules/point/point.module';
import { RankingModule } from './modules/ranking/ranking.module';
import authConfig from './config/modules/auth.config';
import swaggerConfig from './config/modules/swagger.config';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { InterviewModule } from './modules/interview/interview.module';
import { LikeModule } from './modules/like/like.module';
import { CategoryModule } from './modules/category/category.module';

const logger = new Logger('DatabaseConnection');

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
      load: [appConfig, postgresConfig, authConfig, swaggerConfig],
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    PostgresModule,
    UserModule,
    InterviewModule,
    QuizModule,
    AuthModule,
    RankingModule,
    PointModule,
    LikeModule,
    CategoryModule,
  ],
  providers: [Logger],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
