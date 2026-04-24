import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios'
import { firstValueFrom } from 'rxjs'
import { SYSTEMS } from 'systems.config'
import { InstancesResponse } from './type/instance-responce';
import { Instance } from './type/instance-to-frontend';

@Injectable()
export class InstanceService {
  constructor(private readonly httpService: HttpService) { }

  async getInstances(obj: typeof SYSTEMS[0]) {

    try {
      const response = await firstValueFrom(
        this.httpService.post<InstancesResponse>(
          obj.base_url,
          {},
          {
            headers: {
              Authorization: obj.authorization,
              Origin: obj.origin,
              Referer: obj.referer,
              "Content-Type": "application/json"
            }
          }
        )
      )

      if (response.status === 200) {

        return response
      }

    } catch (error) {
      console.error(error.stack)

      return undefined
    }

  }

  async getInstancesToFrontEnd(): Promise<Instance[]> {
    const results: Array<Instance> = []

    for (const obj of SYSTEMS) {
      const response = await this.getInstances(obj)

      if (response) {
        results.push(...response.data.instances.map((d) => ({
          id: `${d.id}`,
          name: d.name,
          phoneNumber: `${d.phone_number}`,
          workspaceId: `${d.workspace_id}`,
          status: `${d.status}`,
          system: obj.sistema,
        })))
      }
    }

    return results
  }


}
