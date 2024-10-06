import { TenantT } from "./Shipment";

export type ModelT = {
  modelId: number;
  makeId: number;
  name: string;
}

export type TruckT = {
  truckId: number;
  tenantId: number;
  modelId: number;
  year: number;
  plate: string;
  vin: string;
  status: boolean;
  tenant: TenantT;
  model: ModelT;
}