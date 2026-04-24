import { PartialType } from '@nestjs/swagger';
import { CreateLastStatusInstanceDto } from './create-last-status-instance.dto';

export class UpdateLastStatusInstanceDto extends PartialType(CreateLastStatusInstanceDto) {}
