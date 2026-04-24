import { Module } from '@nestjs/common';
import { InstanceService } from './instance.service';
import { InstanceController } from './instance.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, InstanceModule],
  controllers: [InstanceController],
  providers: [InstanceService],
})
export class InstanceModule {}
