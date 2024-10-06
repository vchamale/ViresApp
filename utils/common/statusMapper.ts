type IconMapperT = {
  name: string;
  color: string;
}

type StatusMapperT = Record<string, IconMapperT>;

export const statusMapper: StatusMapperT = {
  creado: {
    name: 'truck',
    color: 'green',
  },
  enviado: {
    name: 'truck-loading',
    color: 'blue',
  },
  ruta: {
    name: 'route',
    color: 'blue',
  },
  entregado: {
    name: 'done-outline',
    color: 'red',
  },
  default: {
    name: 'warning',
    color: 'red',
  }
};