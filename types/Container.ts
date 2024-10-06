import { TenantT } from "./Shipment";

export type SizeT = {
  sizeId: number;
  description: string;
  feet: number;
};

export type ContainerT = {
  containerId: number;
  tenantId: number;
  sizeId: number;
  containerNumber: string;
  tenant: TenantT;
  size: SizeT;
};
