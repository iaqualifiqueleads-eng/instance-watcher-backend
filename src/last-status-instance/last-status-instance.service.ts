import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { InstanceService } from 'src/instance/instance.service';
import { SYSTEMS } from 'systems.config';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LastStatusInstanceService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly instance: InstanceService
  ) { }
  private readonly logger = new Logger(LastStatusInstanceService.name);

  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleSyncLastInstance() {

    for (const obj of SYSTEMS) {
      const response = await this.instance.getInstances(obj)

      if (response?.status === 200) {
        for (const resp_instancia of response.data.instances) {
          const instancia_db = await this.prisma.lastStatusInstance.findFirst({ where: { id: resp_instancia.id } })

          if (instancia_db) {
            if (instancia_db.status === "CONNECTED" && resp_instancia.status === "DISCONNECTED") {
              this.logger.verbose(`NOTIFICAR QUEDA DE INSTANCIA ${resp_instancia.id}`)
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

          // await this.prisma.instance.upsert({
          //   where: {
          //     id: resp_instancia.id
          //   },
          //   create: {
          //     id: resp_instancia.id,
          //     name: resp_instancia.name,
          //     phone_number: `${resp_instancia.phone_number}`,
          //     status: resp_instancia.status,
          //     work_space: `${resp_instancia.workspace_id}`,
          //     system: obj.sistema
          //   },
          //   update: {
          //     id: resp_instancia.id,
          //     name: resp_instancia.name,
          //     phone_number: `${resp_instancia.phone_number}`,
          //     status: resp_instancia.status,
          //   },
          // })
        }
      }
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
