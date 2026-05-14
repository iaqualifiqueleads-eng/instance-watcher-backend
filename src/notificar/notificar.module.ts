import { Module } from '@nestjs/common';
import { NotificarService } from './notificar.service';
import { NotificarController } from './notificar.controller';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [NotificarController],
  providers: [NotificarService],
  exports: [NotificarService]
})
export class NotificarModule { }
