import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { LastStatusInstance, User } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificarService {

  constructor(private readonly httpService: HttpService) { }

  private readonly logger = new Logger(NotificarService.name);

  async notificarAdmInstanciaDesconectada({ user, instancia, agente }: { user: User, instancia: LastStatusInstance, agente: LastStatusInstance }) {
    this.logger.warn(`Fail instance System ${instancia.status} Name ${instancia.name} User ${user.nome} User Whats ${user.whatsapp}`)
    await firstValueFrom(
      this.httpService.post(
        "https://ra-bcknd.com/v1/api-trigger/84ggft8lrc6uydqy8gl9",
        {
          nome: `${user.nome}`,
          whatsapp: `${user.whatsapp}`,
          message_fail_instance: `🚨❌ \nCHIP ${instancia.name} \nNUMERO ${instancia.phone_number} \nSISTEMA ${instancia.system}`,
          para_agente: agente.name
        }
      )
    )

  }

}
