import { registerAs } from '@nestjs/config';

export default registerAs('database', () => {
  const databaseUrl = process.env.DATABASE_URL;
  let host;
  let port;
  if (databaseUrl) {
    const url = new URL(databaseUrl);
    host = url.hostname;
    port = url.port;
  }
  return {
    type: 'postgres',
    host: databaseUrl ? host : process.env.DATABASE_HOST || 'localhost',
    port: databaseUrl
      ? port
      : parseInt(process.env.DATABASE_PORT || '5432', 10) || 5432,
    username: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [`${__dirname}/../entities/*.entity{.ts,.js}`],
    synchronize: process.env.NODE_ENV === 'development',
    logging: process.env.NODE_ENV === 'development',
    migrations: [`${__dirname}/../../db/migrations/*{.ts,.js}`],
    migrationsTableName: 'migrations',
  };
});
