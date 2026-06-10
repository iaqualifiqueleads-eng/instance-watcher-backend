import { config } from 'dotenv';
import { ConfigService } from '@nestjs/config';

// config();

// const configService = new ConfigService();

// const envConfigs = {
//   environment: configService.getOrThrow<string>('NODE_ENV'),
//   port: parseInt(configService.getOrThrow<string>('PORT')),

//   database: {
//     url: configService.getOrThrow<string>('DATABASE_URL'),
//     host: configService.getOrThrow<string>('DB_HOST'),
//     port: configService.getOrThrow<string>('DB_PORT'),
//     user: configService.getOrThrow<string>('DB_USER'),
//     name: configService.getOrThrow<string>('DB_NAME'),
//     password: configService.getOrThrow<string>('DB_PASSWORD'),
//   }
// };

// export { envConfigs };

const envConfigs = {
  environment: process.env.NODE_ENV,
  port: parseInt(process.env.PORT || '3000'),

  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    name: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
  }
};

export { envConfigs };