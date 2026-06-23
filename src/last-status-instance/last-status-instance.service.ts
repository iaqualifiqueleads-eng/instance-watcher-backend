import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { InstanceService } from 'src/instance/instance.service';
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
    const systems = await this.prisma.system.findMany();

    for await (const system of systems) {
      console.log('[] => ', system.sistema);

      const response = await this.instance.getInstances(system)

      console.log('[] => ', response?.data.instances.length);

      if (!response) {
        this.logger.warn(`[handleSyncLastInstance] Sistema "${system.sistema}" ignorado — falha na requisição (verifique o token Bearer no banco de dados)`);
        continue;
      }

      if (response.status === 200) {
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
              system: system.sistema,
              work_space: String(resp_instancia.workspace_id),
              color: system.color
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

    for await (const user of users) {
      await this.notificar.notificarAdmInstanciaDesconectada({ user, instancia: instancia_db })
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
