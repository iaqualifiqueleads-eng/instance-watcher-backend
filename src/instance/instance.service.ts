import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { InstancesResponse } from './type/instance-responce';
import { Instance } from './type/instance-to-frontend';
import { LoginResponse } from './type/login-response';
import { PrismaService } from 'src/infra/prisma/prisma.service';
import { System } from '@prisma/client';

const BASE_URL = 'https://ra-bcknd.com/api/zapi/instances';
const LOGIN_URL = 'https://ra-bcknd.com/api/login';

@Injectable()
export class InstanceService {
  constructor(
    private readonly httpService: HttpService,
    private readonly prisma: PrismaService,
  ) { }

  private async requestInstances(system: System, authorization: string) {
    return firstValueFrom(
      this.httpService.post<InstancesResponse>(
        BASE_URL,
        {},
        {
          headers: {
            Authorization: authorization,
            Origin: system.origin,
            Referer: system.referer,
            "Content-Type": "application/json"
          }
        }
      )
    )
  }

  private async login(system: System): Promise<string> {

    console.log(`[login] Tentando login no sistema "${system.sistema}"`);
    const response = await firstValueFrom(
      this.httpService.post<LoginResponse>(
        LOGIN_URL,
        {
          email: system.email,
          hostname: system.origin,
          locale: "pt-BR",
          password: system.senha,
          remember: true,
        },
        {
          headers: {
            Origin: system.origin,
            Referer: system.referer,
            "Content-Type": "application/json"
          }
        }
      )
    )

    const authorization = `Bearer ${response.data.token}`;

    await this.prisma.system.update({
      where: { id: system.id },
      data: { authorization },
    })

    return authorization
  }

  async getInstances(system: System) {
    try {
      const response = await this.requestInstances(system, system.authorization)

      if (response.status === 200) {
        return response
      }

    } catch (error) {
      const status = error?.response?.status;

      if (status === 400 || status === 401) {
        try {
          const authorization = await this.login(system)
          const response = await this.requestInstances(system, authorization)

          if (response.status === 200) {
            return response
          }
        } catch (loginError) {
          const loginStatus = loginError?.response?.status;
          const loginMessage = loginError?.response?.data?.message ?? loginError?.message;
          console.error(`[login] ERRO ao renovar token de "${system.sistema}" — HTTP ${loginStatus ?? 'N/A'}: ${loginMessage}`);
        }

        return undefined
      }

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
