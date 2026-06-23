import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { LastStatusInstance, User } from '@prisma/client';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class NotificarService {

  constructor(private readonly httpService: HttpService) { }

  private readonly logger = new Logger(NotificarService.name);

  async notificarAdmInstanciaDesconectada({ user, instancia }: { user: User, instancia: LastStatusInstance }) {
    this.logger.warn(`Fail instance System ${instancia.status} Name ${instancia.name} User ${user.nome} User Whats ${user.whatsapp}`)
    await firstValueFrom(
      this.httpService.post(
        "https://ra-bcknd.com/v1/api-trigger/vdpgr7sb66lp3sbh6wd6",
        {
          nome: `${user.nome}`,
          whatsapp: `${user.whatsapp}`,
          mensagem: `🚨❌ CHIP: ${instancia.name} NUMERO: ${instancia.phone_number} SISTEMA: ${instancia.system}`,
        }
      )
    )

  }

}
