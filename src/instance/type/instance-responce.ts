export interface InstancesResponse {
  instances: Instance[];
}

export interface Instance {
  id: number;
  workspace_id: number;
  name: string;
  code: string;
  instance_id: string;
  token: string;
  due: string | null;
  phone_number: string;
  profile_name: string | null;
  profile_picture: string | null;
  auto_reply_automation_id: number | null;
  auto_reply_interval: string;
  status: InstanceStatus;
  fail_reason: string | null;
  allow_in_feeder: number;
  creator_id: number;
  provider: string;
  migrated_at: string | null;
}

export type InstanceStatus =
  | 'CONNECTED'
  | 'DISCONNECTED'
  | 'CONNECTING'
  | 'FAILED';