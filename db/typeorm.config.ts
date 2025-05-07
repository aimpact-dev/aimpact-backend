import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();

const databaseUrl = process.env.DATABASE_URL;
let host;
let port;
if (databaseUrl) {
  const url = new URL(databaseUrl);
  host = url.hostname;
  port = url.port;
}

export default new DataSource({
  type: 'postgres',
  host: databaseUrl ? host : process.env.DATABASE_HOST || 'localhost',
  port: databaseUrl ? port : parseInt(process.env.DATABASE_PORT ?? '5432', 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.NODE_ENV === 'development',
  logging: process.env.NODE_ENV === 'development',
  entities: [`${__dirname}/../src/entities/*.entity{.ts,.js}`],
  migrations: [`${__dirname}/migrations/*{.ts,.js}`],
  migrationsTableName: 'migrations',
});
