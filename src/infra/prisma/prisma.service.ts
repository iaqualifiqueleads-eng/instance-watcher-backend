import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '@prisma/client';
import { envConfigs } from 'src/config/configuration';
import * as mysql from 'mysql2';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {

  private readonly logger = new Logger(PrismaService.name);

  private pool: mysql.Pool;

  constructor() {
    const adapter = new PrismaMariaDb({
      host: envConfigs.database.host,
      port: Number(envConfigs.database.port),
      password: envConfigs.database.password,
      user: envConfigs.database.user,
      database: envConfigs.database.name,
      connectionLimit: 10,
    });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();

    this.pool = mysql.createPool({
      host: envConfigs.database.host,
      user: envConfigs.database.user,
      password: envConfigs.database.password,
      database: envConfigs.database.name,
      connectionLimit: 10,
    });
  }
}