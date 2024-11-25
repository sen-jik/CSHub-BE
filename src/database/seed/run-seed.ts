import { NestFactory } from '@nestjs/core';
import { CategorySeedService } from './category/category-seed.service';
import { SeedModule } from './seed.module';

const runSeed = async () => {
  const app = await NestFactory.create(SeedModule);

  await app.get(CategorySeedService).run();

  await app.close();
};

void runSeed();
