type IconMapperT = {
  iconName: string;
  color: string;
};

type StatusMapperT = Record<string, IconMapperT>;

export const statusMapper: StatusMapperT = {
  creado: {
    iconName: 'truck-loading',
    color: '#b889128a',
  },
  enviado: {
    iconName: 'truck-moving',
    color: '#0b57d094',
  },
  ruta: {
    iconName: 'road-circle-check',
    color: '#f270118f',
  },
  finalizado: {
    iconName: 'truck-check',
    color: '#0b57d094',
  },
  cobrado: {
    iconName: 'receipt',
    color: '#0b999c69',
  },
  cancelado: {
    iconName: 'cancel',
    color: '#ff00008c',
  },
  entregado: {
    iconName: 'truck-delivery',
    color: '#038c1882',
  },
  eliminado: {
    iconName: 'delete',
    color: '#767676ba',
  },
  default: {
    iconName: 'warning',
    color: '#ff00008c',
  },
};
