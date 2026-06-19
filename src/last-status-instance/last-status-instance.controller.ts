import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { LastStatusInstanceService } from './last-status-instance.service';
import { CreateLastStatusInstanceDto } from './dto/create-last-status-instance.dto';
import { UpdateLastStatusInstanceDto } from './dto/update-last-status-instance.dto';

@Controller('last-status-instance')
export class LastStatusInstanceController {
  constructor(private readonly lastStatusInstanceService: LastStatusInstanceService) { }

  @Get()
  async handleSyncLastInstance() {
    const x = await this.lastStatusInstanceService.handleSyncLastInstance()
    
    console.log('[handleSyncLastInstance] => ');
    
    return x
  }

  @Get('get-all-instances')
  async getAllInstances() {
    const x = await this.lastStatusInstanceService.getAllInstances()
  
    console.log('[getAllInstances] => ');

    return x
  }
}
