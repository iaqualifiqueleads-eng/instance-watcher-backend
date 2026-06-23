import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { InstancesResponse } from './type/instance-responce';
import { Instance } from './type/instance-to-frontend';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { System } from '@prisma/client';

const BASE_URL = 'https://ra-bcknd.com/api/zapi/instances';

@Injectable()
export class InstanceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) { }

  async getInstances(system: System) {
    try {
      const response = await firstValueFrom(
        this.httpService.post<InstancesResponse>(
          BASE_URL,
          {},
          {
            headers: {
              Authorization: system.authorization,
              Origin: system.origin,
              Referer: system.referer,
              "Content-Type": "application/json"
            }
          }
        )
      )

      if (response.status === 200) {
        return response
      }

    } catch (error) {
      const status = error?.response?.status;
      const message = error?.response?.data?.message ?? error?.message;
      console.error(`[getInstances] ERRO ao buscar instâncias de "${system.sistema}" — HTTP ${status ?? 'N/A'}: ${message}`);

      return undefined
    }
  }

  async getInstancesToFrontEnd(): Promise<Instance[]> {
    const systems = await this.prisma.system.findMany();
    const results: Array<Instance> = []

    for await (const system of systems) {
      const response = await this.getInstances(system)

      if (response) {
        results.push(...response.data.instances.map((d) => ({
          id: `${d.id}`,
          name: d.name,
          phoneNumber: `${d.phone_number}`,
          workspaceId: `${d.workspace_id}`,
          status: `${d.status}`,
          system: system.sistema,
        })))
      }
    }

    return results
  }
}
