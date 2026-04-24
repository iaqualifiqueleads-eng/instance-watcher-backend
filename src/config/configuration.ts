import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

config();

const configService = new ConfigService();

const envConfigs = {
  environment: configService.getOrThrow<string>('NODE_ENV'),
  port: parseInt(configService.getOrThrow<string>('PORT')),

  database: {
    url: configService.getOrThrow<string>('DATABASE_URL'),
    host: configService.getOrThrow<string>('DB_HOST'),
    port: configService.getOrThrow<string>('DB_PORT'),
    user: configService.getOrThrow<string>('DB_USER'),
    name: configService.getOrThrow<string>('DB_NAME'),
    password: configService.getOrThrow<string>('DB_PASSWORD'),
  }
};

export { envConfigs };