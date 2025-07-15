import { NestFactory } from '@nestjs/core';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppModule } from 'src/api/app.module';
import { User } from 'src/entities/user.entity';
import { Leaderboard } from 'src/entities/leaderboard.entity';
import { envLoad } from 'src/shared/config';

async function bootstrap() {
  await envLoad();

  const app = await NestFactory.createApplicationContext(AppModule);

  const userRepo: Repository<User> = app.get(getRepositoryToken(User));
  const lbRepo: Repository<Leaderboard> = app.get(getRepositoryToken(Leaderboard));

  const users = await userRepo.find();
  const rows = users.map((u) =>
    lbRepo.create({
      userId: u.id,
      points: 0,
    }),
  );

  await lbRepo.save(rows);
  console.log(`Created ${rows.length} leaderboard rows.`);

  await app.close();
}

bootstrap().catch((err) => {
  console.error(err);
  process.exit(1);
});
