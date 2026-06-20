import { Module } from '@nestjs/common';
import { InstanceService } from './instance.service';
import { InstanceController } from './instance.controller';
import { HttpModule } from '@nestjs/axios';
import { PrismaModule } from 'src/infra/prisma/prisma.module';

@Module({
  imports: [HttpModule, PrismaModule],
  controllers: [InstanceController],
  providers: [InstanceService],
  exports: [InstanceService]
})
export class InstanceModule {}
