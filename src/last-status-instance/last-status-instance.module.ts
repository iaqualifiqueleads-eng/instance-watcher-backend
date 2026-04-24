import { Module } from '@nestjs/common';
import { LastStatusInstanceService } from './last-status-instance.service';
import { LastStatusInstanceController } from './last-status-instance.controller';
import { PrismaModule } from 'src/infra/prisma/prisma.module';
import { InstanceModule } from 'src/instance/instance.module';

@Module({
  imports: [PrismaModule, InstanceModule],
  controllers: [LastStatusInstanceController],
  providers: [LastStatusInstanceService],
  exports: [LastStatusInstanceService]
})
export class LastStatusInstanceModule {}
