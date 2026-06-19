import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { InstanceService } from 'src/instance/instance.service';
import { SYSTEMS } from 'systems.config';
import { Cron, CronExpression } from '@nestjs/schedule';
import { NotificarService } from 'src/notificar/notificar.service';
import { LastStatusInstance } from '@prisma/client';

@Injectable()
export class LastStatusInstanceService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly instance: InstanceService,
    private readonly notificar: NotificarService,

  ) { }
  private readonly logger = new Logger(LastStatusInstanceService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleSyncLastInstance() {

    for (const obj of SYSTEMS) {
      console.log('[] => ', obj.sistema);
      
      const response = await this.instance.getInstances(obj)

      console.log('[] => ', response?.data.instances.length);

      if (!response) {
        this.logger.warn(`[handleSyncLastInstance] Sistema "${obj.sistema}" ignorado — falha na requisição (verifique o token Bearer no systems.config.ts)`);
        continue;
      }

      if (response?.status === 200) {
        for (const resp_instancia of response.data.instances) {
          const instancia_db = await this.prisma.lastStatusInstance.findFirst({ where: { id: resp_instancia.id } })

          if (instancia_db) {
            if (instancia_db.status === "CONNECTED" && resp_instancia.status === "DISCONNECTED") {
              this.logger.verbose(`NOTIFICAR QUEDA DE INSTANCIA ${resp_instancia.id}`)

              await this.handleNotification(instancia_db)
            }
          }

          await this.prisma.lastStatusInstance.upsert({
            where: {
              id: resp_instancia.id
            },
            create: {
              id: resp_instancia.id,
              name: resp_instancia.name,
              phone_number: `${resp_instancia.phone_number}`,
              status: resp_instancia.status,
              system: obj.sistema,
              work_space: String(resp_instancia.workspace_id),
              color: obj.color
            },
            update: {
              id: resp_instancia.id,
              name: resp_instancia.name,
              phone_number: `${resp_instancia.phone_number}`,
              status: resp_instancia.status
            },
          })
        }
      }
    }
  }


  async handleNotification(instancia_db: LastStatusInstance) {
    const users = await this.prisma.user.findMany();

    const agente = await this.prisma.lastStatusInstance.findFirst({ where: { status: "CONNECTED", work_space: "6936" } })

    if (!agente || !users || !instancia_db) {
      return
    }

    for (const user of users) {
      await this.notificar.notificarAdmInstanciaDesconectada({ user, instancia: instancia_db, agente })
    }
  }


  async getAllInstances() {
    return await this.prisma.lastStatusInstance.findMany({
      orderBy: {
        system: "asc"
      }
    });
  }
}
