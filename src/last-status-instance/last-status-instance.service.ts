import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';

@Injectable()
export class LastStatusInstanceService {

  constructor(private readonly prisma: PrismaService) { }
  private readonly logger = new Logger(LastStatusInstanceService.name);

  async findAll() {
    return this.prisma.lastStatusInstance.findMany()
  }

}
