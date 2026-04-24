import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { InstanceModule } from './instance/instance.module';
import { LastStatusInstanceModule } from './last-status-instance/last-status-instance.module';

@Module({
  imports: [HttpModule, InstanceModule, LastStatusInstanceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
