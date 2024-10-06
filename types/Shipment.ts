import { ContainerT } from "./Container";
import { CurrencyT } from "./Currency";
import { DriverT } from "./Driver";
import { TruckT } from "./Truck";

export type TenantT = {
  mainEmail: string;
  paymentId: number | null;
  subscriptionId: number | null;
  tenantId: number;
  tenantName: string;
  tenantStatusId: number;
};

export type ClientT = {
  address: string;
  clientId: number;
  contactName: string;
  email: string;
  name: string;
  nit: string;
  status: boolean;
  telephone: string;
  tenant: TenantT;
  tenantId: number;
};

export type OriginT = {
  address: string;
  name: string;
  originId: number;
  tenantId: number;
};

export type DestinationT = {
  address: string;
  clientId: number;
  destinationId: number;
  name: string;
};

export type PriceT = {
  amount: number;
  currency: CurrencyT | null;
}

export type ShipmentT = {
  client?: ClientT | null;
  origin?: OriginT | null;
  destination?: DestinationT | null;
  container: ContainerT | null;
  weight: number;
  price: PriceT;
  driver: DriverT | null;
  truck: TruckT | null;
  notes: string;
}
