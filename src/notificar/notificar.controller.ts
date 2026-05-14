import { Controller } from '@nestjs/common';
import { NotificarService } from './notificar.service';

@Controller('notificar')
export class NotificarController {
  constructor(private readonly notificarService: NotificarService) {}
}
